#git submodule update --init --recursive
git pull origin main
git submodule foreach git pull origin main
docker build ./ -t registry.gitlab.com/hydrabyte/bsm-service:latest
docker push registry.gitlab.com/hydrabyte/bsm-service