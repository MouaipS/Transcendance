FROM node:trixie AS dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]