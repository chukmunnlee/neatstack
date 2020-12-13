FROM mysql:8

ENV MYSQL_ROOT_PASSWORD=changeit MYSQL_PORT=3306

WORKDIR /docker-entrypoint-initdb.d

ADD schema.sql 01-schema.sql
ADD data.sql 02-data.sql

EXPOSE ${MYSQL_PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD mysqladmin ping -uroot -p${MYSQL_ROOT_PASSWORD} || exit 1
