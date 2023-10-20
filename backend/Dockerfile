FROM node:18-alpine

WORKDIR /app

COPY ./backend/app/package*.json ./

RUN npm install

COPY ./backend/app/ .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:dev" ]
