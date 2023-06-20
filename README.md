## How to install (Minikube):
1) Start Kubernetes with `minikube start`
2) Enable Ingress addon (if needed) with `minikube addons enable ingress`
3) `kubectl create namespace istio-system`
4) `helm install istio-base istio/base -n istio-system`
5) `helm install istiod istio/istiod -n istio-system --wait`
6) `kubectl label namespace default istio-injection=enabled`
7) Apply helm configurations with `helm install local helm/helm_v1`

You need to wait while cluster successfully starts because we have several services which depends from kafka. Also you A LOT resources to run it properly

## How to run (Minikube):
1) Start tunnel using `minikube tunnel`
2) Access on http://localhost
3) Run `go run test.go` in root dir to test cluster

## New microservices
1) analisator - service which receive messages from aggregator/cities/users microservices and 
with 1 minute interval log to console simple request stats for each service (consumer)
2) logger - service which log to console all requests to aggregator/cities/users microservices (consumer)


## API Requests

### Cities
`GET /api/cities - Get all cities`

`GET /api/cities/untested-request - Broke one pod. Return boolean value which display is pod broken`

`POST /api/cities - Create city`

`PUT /api/cities/:id - Update city with id`

`DELETE /api/cities/:id - Delete city with id`

### Users
`GET /api/users - Get all users`

`POST /api/users - Create user`

`PUT /api/users/:id - Update user with id`

`DELETE /api/users/:id - Delete user with id`


### Aggregator
`GET /api/aggregate - Aggregating request which grab info from cities and users service`

