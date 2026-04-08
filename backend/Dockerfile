FROM node:trixie AS dev

RUN apt-get update 
RUN apt-get install -y curl

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]