#--------------
# 	Base
#-------------

FROM node:trixie AS dev

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]
