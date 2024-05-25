FROM node:latest

WORKDIR /app

COPY ./src/package*.json .

COPY ./ip.sh ./ip.sh
RUN chmod +x ./ip.sh


COPY ./src/. .

RUN ./ip.sh
RUN npm install

CMD ["node", "./server.js"]
