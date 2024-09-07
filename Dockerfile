FROM docker.io/node:lts-alpine
LABEL maintainer="Lyas Spiehler"

RUN apk add --no-cache --upgrade git && rm -rf /var/cache/apk/*

RUN mkdir -p /var/node

WORKDIR /var/node

ARG CACHE_DATE=2024-09-07

RUN git clone https://github.com/lspiehler/token-refresher.git

WORKDIR /var/node/token-refresher

RUN mkdir /token

RUN npm install

CMD ["node", "index"]