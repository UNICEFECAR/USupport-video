# Build docker image of the service locally
docker build -t video:latest .

docker tag video:latest 482053628475.dkr.ecr.eu-central-1.amazonaws.com/usupport-video-api

# Push image to 
docker push 482053628475.dkr.ecr.eu-central-1.amazonaws.com/usupport-video-api

# Update Kuberenetes Cluster applications for this API service
kubectl apply -f config.yaml -f secrets.yaml -f deployment.yaml -f service.yaml
