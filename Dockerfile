FROM node:14.16-alpine3.13
WORKDIR /app

RUN apk add g++ make python3
COPY package.json /app
# https://stackoverflow.com/a/65138098/1791115
COPY *yarn.lock /app
RUN yarn install

COPY . /app
CMD ["yarn", "dev"]
