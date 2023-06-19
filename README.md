## How to install (Minikube):
1) Start Kubernetes with `minikube start`
2) Enable Ingress addon (if needed) with `minikube addons enable ingress`
5) Apply helm configurations with `helm install local helm/*dir with needed helm charts versions*`

## How to run (Minikube):
1) Start tunnel using `minikube tunnel`
2) Access on http://localhost
3) Run `go run test.go` in root dir to test cluster

## Before run helm_v2 need to run following comands in console and restart cluster:
1) `kubectl create namespace istio-system`
2) `helm install istio-base istio/base -n istio-system`
3) `helm install istiod istio/istiod -n istio-system --wait`
4) `kubectl label namespace default istio-injection=enabled`

## Helm dirs
1) helm_v1 - simple cluster version
1) helm_v2 - cluster with retry/timeot functional
1) helm_v1 - cluster with circuit breaker

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

