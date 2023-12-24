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
