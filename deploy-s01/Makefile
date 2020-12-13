
VERSION := latest
BRANCH := part15
TAG := $(shell git rev-parse --short $(BRANCH))
SRC := main.go pkged.go

golang: angular
	pkger --include /frontend \
		&& GOOS=linux GOARCH=amd64 go build -o bin/fe-amd64-linux --tags netgo $(SRC) \
		&& GOOS=windows GOARCH=amd64 go build -o bin/fe-amd64-windows --tags netgo $(SRC) \
		&& GOOS=darwin GOARCH=amd64 go build -o bin/fe-amd64-darwin --tags netgo $(SRC) 

angular:
	rm -rf frontend/ \
		&& cd ../frontend \
		&& ./node_modules/.bin/ng build --prod \
		&& cp -r dist/frontend ../deploy/frontend

docker:
	docker build -t chukmunnlee/neatstack:$(TAG) --build-arg BRANCH=$(BRANCH) . \
		&& docker tag chukmunnlee/neatstack:$(TAG) chukmunnlee/neatstack:$(VERSION)
