FROM node:22.1.0-alpine3.18 AS prod

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --frozen-lockfile

COPY index.js .
COPY src ./src
COPY static ./static
COPY templates ./templates

CMD [ "node", "index.js" ]
