
VERSION := latest
BRANCH := part15
TAG := $(shell git rev-parse --short $(BRANCH))

docker:
	docker build -t chukmunnlee/neatstack:$(TAG) --build-arg BRANCH=$(BRANCH) .
	docker tag chukmunnlee/neatstack:$(TAG) chukmunnlee/neatstack:$(VERSION)
