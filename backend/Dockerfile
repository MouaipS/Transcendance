FROM public.ecr.aws/docker/library/node:trixie AS dev

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
