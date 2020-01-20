# typescript node hello world

A simple nodejs hello world implementation in typescript

## Running

```
> docker build -t ts-node-hello .
...
> docker run --network="host" ts-node-hello start
...
```
Example with custom port:
```
> docker run --network="host" ts-node-hello start port=3001
```

## Testing
```
> docker run ts-node-hello test
```
