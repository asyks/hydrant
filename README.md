# hydrant

A firebase app in node, express, and typescript

## Running

```
> docker build -t hydrant .
...
> docker run --network="host" hydrant start
...
```
Example with custom port:
```
> docker run --network="host" hydrant start port=3001
```

## Testing
```
> docker run hydrant test
```
