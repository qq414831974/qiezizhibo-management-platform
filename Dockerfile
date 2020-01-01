FROM nginx
MAINTAINER wufan
RUN mkdir -p /usr/share/nginx/html/anchor/
COPY ./build/  /usr/share/nginx/html/anchor/
COPY ./nginx.conf /etc/nginx/nginx.conf