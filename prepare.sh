TAG=${1?missing - tag.}

echo $TAG

cp ./package.json ./services/aggregator
cp ./package.json ./services/cities
cp ./package.json ./services/users
cp ./package.json ./services/loader

docker build -t vladshalavinskiy/aggregator:$TAG -f services/aggregator/Dockerfile services/aggregator
docker build -t vladshalavinskiy/cities:$TAG -f services/cities/Dockerfile services/cities
docker build -t vladshalavinskiy/users:$TAG -f services/users/Dockerfile services/users
docker build -t vladshalavinskiy/loader:$TAG -f services/loader/Dockerfile services/loader

docker push vladshalavinskiy/aggregator:$TAG
wait

docker push vladshalavinskiy/cities:$TAG
wait

docker push vladshalavinskiy/users:$TAG
wait

docker push vladshalavinskiy/loader:$TAG
wait
