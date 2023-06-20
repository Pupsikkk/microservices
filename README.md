## How to install (cluster):
1) Start Kubernetes with `minikube start`
2) Enable Ingress addon (if needed) with `minikube addons enable ingress`
2) Enable Metrics-server addon (if needed) with `minikube addons enable metrics-server`
3) Apply helm configurations with `helm install local helm/helm_v1`
5) Run `kubectl create namespace monitoring`
5) Run `helm install --namespace monitoring prometheus prometheus-community/kube-prometheus-stack`

You need to wait while cluster successfully starts because we have several services which depends from kafka

## How to run (minikube):
1) Start tunnel using `minikube tunnel`
2) Access on http://localhost

## how get access to Grafana:
1) Run in console `kubectl apply -f k8s/grafana.yaml`
2) Run in console `kubectl port-forward --namespace monitoring service/prometheus-grafana 3000:80`
3) Get access on `localhost:3000` with following credentials `login:admin password:prom-operator`

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

