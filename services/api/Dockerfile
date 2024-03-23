FROM node:21.7.1-alpine3.19 as base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

FROM base as production
RUN npm build