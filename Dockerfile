ARG BASE_IMAGE=node:13.6.0-alpine

FROM ${BASE_IMAGE} as builder

RUN apk add --no-cache ca-certificates

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY package.json /opt/hydrant/package.json
COPY package-lock.json /opt/hydrant/package-lock.json

RUN npm install --loglevel=error --no-optional --save

FROM ${BASE_IMAGE}

RUN mkdir -p /opt/hydrant
WORKDIR /opt/hydrant

COPY --from=builder /opt/hydrant/node_modules /opt/hydrant/node_modules

COPY tsconfig.json /opt/hydrant/tsconfig.json
COPY package.json /opt/hydrant/package.json
COPY package-lock.json /opt/hydrant/package-lock.json

COPY src /opt/hydrant/src
COPY test /opt/hydrant/test
