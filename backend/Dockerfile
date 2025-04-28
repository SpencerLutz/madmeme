FROM node:23.11.0-alpine3.21 AS prod

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --frozen-lockfile

COPY index.js .
COPY src ./src
COPY static ./static
COPY templates ./templates

CMD [ "node", "index.js" ]
