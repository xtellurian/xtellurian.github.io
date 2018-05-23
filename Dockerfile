FROM node:9-alpine

LABEL "author"="Rian Finnegan"

# install Hexo
RUN npm install hexo-cli -g

# set workdir
WORKDIR /public

COPY . .

RUN npm install

# hexo default port
EXPOSE 4000

CMD ["hexo", "server"]