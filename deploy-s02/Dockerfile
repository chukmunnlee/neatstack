FROM node:15 AS builder

ENV APP_DIR=/app

ARG BRANCH=part28

RUN npm i -g @angular/cli
RUN npm i -g @nestjs/cli

WORKDIR ${APP_DIR}

RUN git clone -b ${BRANCH} --single-branch https://github.com/chukmunnlee/neatstack.git

# build angular
WORKDIR ${APP_DIR}/neatstack/frontend

RUN npm i
RUN ng build --prod

# build nest
WORKDIR ${APP_DIR}/neatstack/backend

RUN npm i
RUN nest build

# assemble the final 'binaries' 
FROM node:15

ENV APP_DIR=/app PORT=8080 \
	DB_USER=root DB_PASSWORD=changeit \
	DB_TIMEZONE=+08:00 DB_CONNECTION_LIMIT=4

WORKDIR ${APP_DIR}

COPY --from=builder ${APP_DIR}/neatstack/frontend/dist/frontend frontend
COPY --from=builder ${APP_DIR}/neatstack/backend/dist/ .
COPY --from=builder ${APP_DIR}/neatstack/backend/package.json .
COPY --from=builder ${APP_DIR}/neatstack/backend/package-lock.json .

RUN npm i

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD curl -f localhost:${PORT}/api/healthz || exit 1

ENTRYPOINT [ "node", "backend/src/main", "--clientPath", "frontend" ]
