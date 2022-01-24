FROM node:14.18.3-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
