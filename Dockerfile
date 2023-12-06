FROM node:18.17.1

WORKDIR /task-manager

COPY .env ./
COPY package.json ./
COPY src ./src

RUN npm install

CMD ["npm", "start"]
