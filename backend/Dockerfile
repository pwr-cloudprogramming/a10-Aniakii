FROM node:latest

WORKDIR /app

COPY ./src/package*.json ./

COPY ./src/. ./

RUN npm install
CMD ["node", "./server.js"]
