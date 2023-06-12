
TAG=${1?missing - tag.}

echo $TAG

cp ./package.json ./services/aggregator
cp ./package.json ./services/cities
cp ./package.json ./services/users
cp ./package.json ./services/loader

docker build -t vladshalavinskiy/aggregator:$TAG -f services/cities/Dockerfile .
docker build -t vladshalavinskiy/cities:$TAG -f services/cities/Dockerfile .
docker build -t vladshalavinskiy/users:$TAG -f services/users/Dockerfile .
docker build -t vladshalavinskiy/loader:$TAG -f services/loader/Dockerfile .

docker push vladshalavinskiy/aggregator:$TAG
wait

docker push vladshalavinskiy/cities:$TAG
wait

docker push vladshalavinskiy/users:$TAG
wait

docker push vladshalavinskiy/loader:$TAG
wait