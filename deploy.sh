REDEPLOY=$1

if [ "$REDEPLOY" = 'deploy' ] || [ "$REDEPLOY" = 'redeploy' ]
then
    # Build docker image of the service locally
    docker build -t video:latest .

    docker tag video:latest 482053628475.dkr.ecr.eu-central-1.amazonaws.com/usupport-video-api

    # Push image to 
    docker push 482053628475.dkr.ecr.eu-central-1.amazonaws.com/usupport-video-api

    if [ "$REDEPLOY" = 'deploy' ]
    then
        # Update Kuberenetes Cluster applications for this API service
        kubectl apply -f config.yaml -f secrets.yaml -f deployment.yaml -f service.yaml
    elif [ "$REDEPLOY" = 'redeploy' ]
    then 
        kubectl apply -f config.yaml -f secrets.yaml -f service.yaml
        kubectl rollout restart deployment video
    fi

else
    echo "Please select either to deploy or redeploy k8s pod"
fi
