FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

ENV PORT 8000
ENV HOST 0.0.0.0

RUN yarn prisma generate --schema=./src/infrastructure/prisma/schema.prisma

RUN yarn build

EXPOSE 8000

CMD [ "yarn", "start" ]