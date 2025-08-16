FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run test

RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]