FROM node:18-alpine

WORKDIR /app

COPY ./frontend/app/package*.json ./

RUN npm install

COPY ./frontend/app/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start" ]
