FROM node:trixie AS dev

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install @prisma/client

COPY . .

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]