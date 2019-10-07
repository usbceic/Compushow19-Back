FROM node:10.6-alpine
LABEL MANTAINER="@german1608"

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npm run tsc

EXPOSE 8080
CMD [ "npm", "run", "prod" ]
