ARG BASE_IMAGE=node:13.6.0-alpine

FROM ${BASE_IMAGE} as builder

RUN apk add --no-cache ca-certificates

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --loglevel=error --no-optional --save

FROM ${BASE_IMAGE}

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY --from=builder /opt/hydrant/node_modules node_modules

COPY tsconfig.json tsconfig.json
COPY package.json package.json
COPY package-lock.json package-lock.json

COPY src /opt/hydrant/src
COPY test /opt/hydrant/test
