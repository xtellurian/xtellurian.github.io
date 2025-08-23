---
title: "Digital Assistants & Azure Event Grid"
date: 2018-03-04T16:13:00Z
tags: ["digital-assistants-azure-eventgrid"]
---

![Robot Assistant Cartoon](/images/robot.jpg)

## The Digital World

The digital world exists at once everyone and nowhere. Things are happening there, at the speed of light. Those events effect our lives, but as physical beings it takes us time and effort to response. A digital assistant responds to events in the digital world, helping you that pervasive yet ephemeral environment. 

As the digital world becomes busier and noisier, we need cloud-scale technologies that allow us to respond to events in real time. Azure event grid proves exactly that type of medium, for events on the web and in the cloud. Using event grid and bot framework, we can build bots that observe events in the grid, let you know when important things are happening, and provide options for responding.

## Azure Event Grid

Azure Event Grid allows you to easily build applications with event-based architectures. You select the Azure resource you would like to subscribe to, and give the event handler or WebHook endpoint to send the event to. Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. Event Grid also has custom support for application and third-party events, using custom topics and custom webhooks.

![Azure Event Grid Sources and Handers Diagram](https://docs.microsoft.com/en-us/azure/event-grid/media/overview/functional-model.png)

More publishers and handlers are being added. Event Grid is currently in preview, but is expected to be in GA by the end of 2017.

The best features of event grid are:

* Cloud Scale: Can support millions of events per second
* Cloud Pricing: GA pricing will be $0.60 / million events
* Low Latency: Events are delivered usually within a second
* Flexible Schema: Arbitrary JSON payloads
* Guaranteed Delivery: Retry policy and eventual consistency

## Bots in the Grid

Conversations are growing in popularity as an interface with the digital world. Conversations naturally morph between the synchronous and asynchronous, making them a perfect fit for how we interact with modern applications. 

### Responding to Digital Events

The following shows how to listen for events with Microsoft Bot Framework. In this example, I'll be using an ASP.NET bot, so this code will work for any ASP.NET application, and the same pattern holds for most web applications.

### Architecture

Subscribing your bot to events is actually very simple. Just implement an http endpoint that receives incoming webhooks.

![Architecture Diagram for Connecting Bots to Event Grid](/content/images/2017/10/boteventgridarchitecture.png)

#### Incoming Event Data Structure

Incoming events, via webhook, are delivered by the body of an HTTP Post. The following is an example:

```.language-json
{[
  {
    "Data": {
      "Correlation": {
        "ExternalReferenceId": "9c551c4f-9a73-4565-8590-b4b81b074dfb"
      },
      "To": {
        "Id": "myUserId",
        "DisplayName": "Rian"
      },
      "Amount": 150.0,
      "Message": "Whatever you like"
    },
    "Id": "fbfaab9e-a328-4c77-bee7-8fb95264d4fd",
    "Subject": "custom\\value",
    "EventType": 0,
    "EventTime": "2017-10-25T23:01:37.3456283Z",
    "topic": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XX/RESOURCEGROUPS/YOUR-GROUP/PROVIDERS/MICROSOFT.EVENTGRID/TOPICS/YOUR_TOPIC"
  }
]}
```

Since this is a custom event, everything in the *Data* field is yours to play with. The other top level fields define how the event is processed within event grid.

### Security

Event Grid can provide up to a million events per second, which could be the biggest DDOS cannon on the public cloud! Luckily, when you register a webhook subscriber, the first request contains a challenge that must be responded to correctly, else the subscription fails. The challenge request has the same structure as a normal event, however the *data* field contains a validation code that must be returned in the HTTP response.

```.language-json
[{
  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subject": "",
  "data": {
    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
  },
  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
  "eventTime": "2017-08-06T22:09:30.740323Z"
}]
```

You must return the validation code as a validation response:
```.language-json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

Its also best practice to protect your webhook endpoint with a secret key. Its quite simple: just provide that key when setting up the subscription, and the request path contains that key before processing any event. Your webhook path should look like:

`https://<base_url>/api/events?secret=YOUR_SECRET_KEY`


### Handling Incoming Events with ASP.NET

The key method on your controller accepts an HTTP Post and should return a 200 or 202, to ensure that event grid knows that the event has been received, and won't retry.
```.language-csharp
public async Task<HttpResponseMessage> Post([FromBody]dynamic e)
{
  foreach ( var azEvent in e)
  {
    if (azEvent?.data?.validationCode != null)
    {
      return Request.CreateResponse(HttpStatusCode.OK, new { validationResponse = x.data.validationCode });
    }
    else
    {
      HandleEvent(azEvent);
    }
  }
  return Request.CreateResponse(HttpStatusCode.OK);
}
```
[See this gist for the full controller code](https://gist.github.com/xtellurian/1ee357452668d7c3f46b83410c84435c)

### Creating and Subscribing to Topics and Events

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Follow these steps in the Azure Portal to use custom topics:

![Creating Topics and Subs in the Azure Portal](/content/images/2017/10/eventgridportal.PNG)


0. Create an Azure Resource Group if you don't have one already.
1. Under *More Services* search for event grid, and select **Event Grid Topics**
2. Create a new topic
3. Under *More Services* search for event grid, and select **Event Grid Subscriptions**
4. Create a new subscription, and enter the endpoint you created as a webhook.

You can follow detailed steps [here](https://docs.microsoft.com/en-us/azure/event-grid/custom-event-quickstart-portal)

### Dev & Test using Ngrok

You can also get events directly to your local machine using [ngrok](https://ngrok.com/). When you run a local server, there are listeners on local ports e.g. `localhost:44313/api/events`. Using ngrok, you can expose your local server to the web. After installing ngrok, run the following command: `ngrok http 44313 -host-header="localhost:44313"` and you'll have a public url you can then set as a new subscription.

![Ngrok Screenshot](/content/images/2017/10/ngrokexample.PNG)

Add your public ngrok url, with events path and key, as a new event subscription: `https://xxxxxx.ngrok.io/api/events?key=YOUR_SECRET_KEY`



### Proactive Bot Messages

Now your bot web server is receiving events, you can use that power to send proactive messages to users affected by that event. For example, you may generate an event every time users post a comment. You can [read the documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-proactive-messages) of proactive messages on Microsoft Bot Framework, or there are [several samples on GitHub](https://github.com/MicrosoftDX/botFramework-proactiveMessages).

A great use case for proactive messages is billing and payment requests. Every service provider wants a fast, reliable and easy billing experience for their customers. Imagine if your company's digital assistant could proactively reach out to your customers, let them know their bill's are almost due, and provide them simple ways to pay.

![Example of a Proactive Message for a Payment Request](/content/images/2017/10/PaymentRequest.PNG)


### Conclusion

Azure Event Grid is a great way to trigger proactive messages from intelligent bots - but there's so much more it can do. It's designed for modern applications, particularly those using serverless, because of its ability to scale. It lets you connect on-premises and cloud infrastructure via a fast and reliable messaging. It's really fast, and super easy to use. 10/10 - would use again.


### Further Reading
* [ASP.NET Controller for Event Grid Webhooks](https://gist.github.com/xtellurian/1ee357452668d7c3f46b83410c84435c)
* [Event Grid](https://docs.microsoft.com/en-us/azure/event-grid/)
* [Event Grid - Quickstart on the Azure Portal](https://docs.microsoft.com/en-us/azure/event-grid/custom-event-quickstart-portal)
* [ngrok](https://ngrok.com/)
* [Bot Framework](https://docs.microsoft.com/en-us/bot-framework/)
* [Proactive Messages Documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-proactive-messages)
* [Proactive Messages Samples](https://github.com/MicrosoftDX/botFramework-proactiveMessages)