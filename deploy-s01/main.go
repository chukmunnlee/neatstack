package main

import (
	"flag"
	"fmt"
	"log"
	"strings"
	"time"

	"net/http"

	"github.com/markbates/pkger"
)

type wrapperResponseWriter struct {
	http.ResponseWriter
	StatusCode int
}

func (w *wrapperResponseWriter) WriteHeader(sc int) {
	w.StatusCode = sc
	w.ResponseWriter.WriteHeader(sc)
}

func getIP(req *http.Request) string {
	// X-Forwarded-For: ip, ip-proxy0, ip-proxy1, ...
	forwarded := req.Header.Get("X-Forwarded-For")
	if "" != forwarded {
		return strings.Split(forwarded, ",")[0]
	}
	return strings.Split(req.RemoteAddr, ":")[0]
}

func logger(handler http.Handler) http.Handler {

	f := func(writer http.ResponseWriter, req *http.Request) {
		ip := getIP(req)
		method := req.Method
		url := req.RequestURI
		startTime := time.Now()

		wrapper := &wrapperResponseWriter{ResponseWriter: writer}

		handler.ServeHTTP(wrapper, req)

		dur := time.Now().Sub(startTime)

		log.Printf("%s %s %s %d [%dms]\n", ip, method, url, wrapper.StatusCode, dur.Milliseconds())
	}
	return http.HandlerFunc(f)
}

func main() {

	port := flag.Int("port", 8080, "Set HTTP port. Default is 8080")
	flag.Parse()

	h := http.FileServer(pkger.Dir("/frontend"))
	http.Handle("/", h)

	intf := fmt.Sprintf("0.0.0.0:%d", *port)
	log.Printf("Starting HTTP server on port %d\n", *port)
	if err := http.ListenAndServe(intf, logger(http.DefaultServeMux)); nil != err {
		log.Fatalf("Cannot start HTTP server. ERROR: %v\n", err)
	}

}
