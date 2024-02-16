## setup dev env
- install docker
- run docker image containing mongodb via:
```sh
docker run -d -p 27017:27017 --name test-mongo mongo:latest
```
- change db connection link
```js
mongoose.connect(
    `mongodb://127.0.0.1:27017/test-mongo`,
  [...]
)
```

## redis docker image for test purposes
```sh
docker run --name redis-test -p 6379:6379 -d redis
```


## Generating OPENSSL TLS-certificate for dev purpose 
```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```
'-nodes' will skip the private key encryption!
