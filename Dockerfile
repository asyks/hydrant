FROM node:13.6.0-alpine as builder

RUN apk add --no-cache ca-certificates

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --no-optional --save

FROM node:11.14.0-alpine

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY --from=builder /opt/hydrant/node_modules node_modules

COPY tsconfig.json tsconfig.json
COPY package.json package.json
COPY package-lock.json package-lock.json

COPY src /opt/hydrant/src
COPY test /opt/hydrant/test
COPY firebase.json /opt/hydrant
