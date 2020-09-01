FROM node:10.18 AS build

LABEL Organization="Koda Software"
LABEL Author="Christian Shaw"

WORKDIR /

COPY src src/
COPY package.json package-lock.json base.tsconfig.json tsconfig.json README.md ./

RUN npm i
RUN npm run compile

FROM node:10.18-alpine AS runtime

WORKDIR /opt/app

COPY --from=build /build ./
COPY dist/docker-entrypoint.sh ./

RUN npm i --production
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]
