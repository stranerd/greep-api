FROM node:21.7.1-alpine3.19 as base
WORKDIR /app
RUN apk add --no-cache python3 make g++
RUN rm -rf /var/cache/apk/*
COPY package.json ./
RUN npm install
COPY . .

FROM base as production
RUN npm run build
