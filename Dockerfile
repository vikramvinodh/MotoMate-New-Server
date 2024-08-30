#  Dockerfile for Node Express Backend

FROM node:22-alpine3.19
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5050
CMD ["npm","run","start"]