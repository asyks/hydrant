FROM node:13.6.0-alpine as builder

RUN apk add --no-cache ca-certificates

RUN mkdir -p /opt/ts-node-hello
WORKDIR /opt/ts-node-hello

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --no-optional

FROM node:11.14.0-alpine

RUN mkdir -p /opt/ts-node-hello
WORKDIR /opt/ts-node-hello

COPY --from=builder /opt/ts-node-hello/node_modules node_modules

COPY tsconfig.json tsconfig.json
COPY package.json package.json
COPY package-lock.json package-lock.json

COPY src/constants.ts /opt/ts-node-hello/src/constants.ts
COPY src/hello.ts /opt/ts-node-hello/src/hello.ts
COPY src/server.ts /opt/ts-node-hello/src/server.ts
COPY test/test.ts /opt/ts-node-hello/test/test.ts

ENTRYPOINT [ "npm" ]
