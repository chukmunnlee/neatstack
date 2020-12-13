BRANCH := part28
TAG := $(shell git rev-parse --short $(BRANCH))

.PHONY: all

all: database application

database:
	cd ../database \
		&& docker build -t chukmunnlee/neatdb:$(TAG) . \
		&& docker tag chukmunnlee/neatdb:$(TAG) chukmunnlee/neatdb:v1

application:
	docker build -t chukmunnlee/neatstack:$(TAG) --build-arg BRANCH=$(BRANCH) . \
		&& docker tag chukmunnlee/neatstack:$(TAG) chukmunnlee/neatstack:v2

