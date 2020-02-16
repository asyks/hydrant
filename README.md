# hydrant

A bare-bones redis http frontend app in typescript

## Developing

The easiest way to setup hydrant for local testing is using docker and
docker-compose. Simply build and run the project using docker-compose in 
the usual way.

### Building for local testing

Building hydrant_app and hydrant_store with docker-compose
```
docker-compose build
```

### Running the dev server

Running the dev server With docker-compose:
```
docker-compose up --build
```

### Automated Tests

Running tests with docker-compose:
```
> docker-compose run app npm test
```

Running tests with just docker:
```
> docker run hydrant_app npm test
```
