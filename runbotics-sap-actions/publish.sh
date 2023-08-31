rush build -t runbotics-sap-actions

PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo Version is: $PACKAGE_VERSION

docker-compose -f docker-compose.build.yml build runbotics-sap-actions
docker tag runbotics-sap-actions-runbotics-sap-actions:latest  runbotics/runbotics-sap-actions:${PACKAGE_VERSION}
docker push runbotics/runbotics-sap-actions:${PACKAGE_VERSION}