# to build frontend/angular
FROM node:14 as ng-builder

ARG APP_DIR=/app
ARG BRANCH=part15

WORKDIR ${APP_DIR}

RUN git clone -b ${BRANCH} --single-branch https://github.com/chukmunnlee/neatstack.git

WORKDIR ${APP_DIR}/neatstack/frontend

RUN npm i

RUN ./node_modules/.bin/ng build --prod

# to package the application into Caddy
FROM caddy:2

ARG APP_DIR=/app

ENV APP_PORT=8080

WORKDIR ${APP_DIR}

ADD Caddyfile .
COPY --from=ng-builder ${APP_DIR}/neatstack/frontend/dist/frontend frontend

EXPOSE ${APP_PORT}

ENTRYPOINT [ "caddy", "run" ]
