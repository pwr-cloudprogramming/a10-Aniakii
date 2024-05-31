FROM node:latest

WORKDIR /app

COPY ./src/package*.json .

COPY ./ip.sh ./ip.sh
RUN chmod +x ./ip.sh


COPY ./src/. .

ENV COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
ENV COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID

RUN ./ip.sh
RUN npm install


# RUN echo "COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}" && echo "COGNITO_CLIENT_ID=${COGNITO_CLIENT_ID}"


CMD ["node", "./server.js"]
