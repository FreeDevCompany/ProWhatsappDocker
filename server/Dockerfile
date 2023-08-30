FROM node:latest
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD ["yarn","start:dev"]