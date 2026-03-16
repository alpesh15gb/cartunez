FROM node:20

WORKDIR /app/storefront

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV PORT 3000
CMD ["npm", "run", "start"]
