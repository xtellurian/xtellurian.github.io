---
title: Bots in Kubernetes
date: 2018-08-02 11:11:00
tags:
---

# Bots in Kube

So you've built for first bot with Microsoft [BotBuilder SDK](https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0), deployed it to [Azure App Service](https://azure.microsoft.com/en-au/services/app-service/) or [GCloud App Engine](https://cloud.google.com/appengine/), and everything is just swell. Then along comes your company's CTO, who says they've committed to all their services having zero downtime (best effort of course). On the same day, your friend had the great idea to start doing A/B testing. What do you do?

You've outgrown the App Service platform. Hello Kubernetes.

## What to do

There's three things we have to do to get our bot into k8s.

1. Containerise the bot code
2. Provision a Kubernetes Cluster
3. Enable cluster HTTPS Ingress

## Containerising a Bot

Lucky for us, bots look mostly like web servers, and we're pretty good at containerising web servers. Create a `Dockerfile` that builds your bot image. It should look something like this one, which uses the [builder pattern](https://docs.docker.com/develop/develop-images/multistage-build/) to reduce the size of the output image.

```docker
# this file builds a bot built in Typescript.
FROM ubuntu:16.04 as builder
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash && \
    apt-get install -y git nodejs build-essential
RUN npm install -g node-gyp && \
    npm install -g typescript
WORKDIR /build
COPY my-bot/package.json .
RUN npm install # this helps reduce build times during dev iteration
COPY my-bot .
RUN npm run build


FROM node:10-alpine
WORKDIR /app/
COPY --from=builder /build .
ENTRYPOINT [ "node", "js/app.js" ]
```

Running the container locally and connecting with the [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator), you might see this error 

```txt
BotFrameworkAdapter.processActivity(): 500 ERROR - FetchError: request to http://localhost:60321/v3/conversations/1dk6m0la5ji6/activities/bcmfna2mfjmf failed, reason: connect ECONNREFUSED 127.0.0.1:60321
```

That's because the Emulator opens a localhost port to listen for messages from the bot, but that address is not actually accessible from inside the container, hence the connection refused. You need to disable 'Bypass ngrok for local addresses'.

![/images/botsinkube/bypass-ngrok.png](Screenshot of bypass ngrok on localhost setting disabled)

### Publish the image

Once you've built the image, publish it to the repository of your choice, e.g. [Docker Hub](https://hub.docker.com/). Now it's ready to be deployed into the cluster.


## Provision a Kubernetes Cluster

Now creating a kubernetes cluster from scratch is hard. If your like me, you'd prefer if someone else did the hard work for you. Well they have!

[Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough) is the fasted way to get a cluster up and running. Just spin it up via Azure CLI. Then run this command - `az aks get-credentials` - and kubectl now interacts with the cluster. Almost too easy.

> Side note: It's important to have a stateless bot (i.e. state remains in a remote database like CosmosDB and not memory) because Kubernetes deployments work best this way.

### Deploy the bot

Your bot will need three kubernetes objects: a `deployment`, a `service`, and a `secret`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-bot-deployment
  labels:
    app: my-bot
spec:
  replicas: 2
  selector:
    matchLabels:
      app: my-bot
  template:
    metadata:
      labels:
        app: my-bot
    spec:
      containers:
      - name: my-bot
        image: dockerhubrepo/my-bot:tag
        ports:
        - containerPort: 80
        env:
        - name: PORT
          value: "80"
        - name: MICROSOFT_APP_ID
          valueFrom:
            secretKeyRef:
              name: microsoft-bot-app
              key: app-id
        - name: MICROSOFT_APP_PASSWORD
          valueFrom:
            secretKeyRef:
              name: microsoft-bot-app
              key: app-password
---
kind: Service
apiVersion: v1
metadata:
  name: my-bot-service
spec:
  selector:
    app: my-bot
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

Create the secret:

```bash
cd /your/secrets/directory
echo -n 'your-id' > ./app-id
echo -n 'your-password' > ./app-password
kubectl create secret generic microsoft-bot-app --from-file=./app-password --from-file=./app-id
```

## Enable Cluster HTTPS Ingress

This step is probably the most convoluted, but once you're up and running, it should require much intervention. I'm not going to rewrite all the steps (there are many) but follow [this walkthrough](https://docs.microsoft.com/en-us/azure/aks/ingress) for enabling HTTPS ingress on AKS.

> Note: Be sure to use `letsencrypt-prod` - the Bot Emulator and Azure Bot Service will not work unless the bot is hosted under a trusted certificate.

If you're following the anove walkthrough, you'll need to customise your http ingress routes.

Modify the K8s Ingress object to look something like this:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-bot-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    certmanager.k8s.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - my-dns-name.australiaeast.cloudapp.azure.com
    secretName: tls-secret
  rules:
  - host: my-dns-name.australiaeast.cloudapp.azure.com
    http:
      paths:
      - path: /bot
        backend:
          serviceName: my-bot-service
          servicePort: 80
```

That's it, you're done. You should be able to connect to your bot at `https://my-dns-name.australiaeast.cloudapp.azure.com/bot/api/messages`

## Sample

You can see a full sample [on github](https://github.com/xtellurian/halp-bot)

## Troubleshooting

### By bot doesn't respond at all...

Check the validity of the certificate by navigating to your https url in a browser. If the browser doesn't trust the certificate, your ingress isn't configured properly. Check the issuer of the certificate.

### The bot says I'm unauthorized...

Check the values of MICROSOFT_APP_ID and MICROSOFT_APP_PASSWORD. They should be the same in the [Bot Service Connector](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-connector-concepts?view=azure-bot-service-3.0#bot-connector-service) and in your code. The password is hidden inside a kubernetes secret.

### Something is wrong...

You can get the logs from your container with the following command

```bash
$ kubectl logs --selector=app=my-bot
restify listening to http://[::]:80
Yes, this service is alive
recieved a message
Replying: [conversationUpdate event detected]
```