FROM node:21.6.2-alpine3.18 as base
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .

FROM base as production
RUN yarn build