FROM node:16

WORKDIR /app

ADD . .

RUN npm i && cd vue && npm i && npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]