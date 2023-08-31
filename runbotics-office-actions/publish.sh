rush build -t runbotics-office-actions

PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

docker-compose -f docker-compose.build.yml build runbotics-office-actions
docker tag runbotics-office-actions-runbotics-office-actions:latest  runbotics/runbotics-office-actions:${PACKAGE_VERSION}
docker push runbotics/runbotics-office-actions:${PACKAGE_VERSION}