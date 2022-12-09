FROM amd64/nginx:latest
MAINTAINER wufan
RUN mkdir -p /usr/share/nginx/html/manage/
COPY ./build/  /usr/share/nginx/html/manage/
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/
COPY ./tls.crt  /etc/nginx/tls.crt
COPY ./tls.key  /etc/nginx/tls.key