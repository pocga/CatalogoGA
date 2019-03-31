FROM node:8.9.4

WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .

RUN npm install
COPY . .

EXPOSE 8080

CMD ["node", "src/app.js"]
