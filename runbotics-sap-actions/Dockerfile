FROM mcr.microsoft.com/windows/nanoserver:ltsc2019 as production

ENV NODE_ENV production

USER node

WORKDIR /home/node

COPY package.json .
COPY package-lock.json .
COPY dist .
COPY node_modules .

FROM mcr.microsoft.com/windows/nanoserver:ltsc2019

ARG EXTENSION_NAME

COPY --from=production /home/node/ /extension/$EXTENSION_NAME/

ENTRYPOINT echo "Installing extension $EXTENSION_NAME"; \
           ls -al /extension; \
           cp -rf /extension/. /runbotics-extensions/

