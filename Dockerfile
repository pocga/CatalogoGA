FROM node:10.15.3

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .

RUN npm install
COPY . .

EXPOSE 8080

CMD ["node", "src/app.js"]
