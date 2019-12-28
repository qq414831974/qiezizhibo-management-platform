FROM nginx
MAINTAINER wufan
RUN mkdir -p /usr/share/nginx/html/manage/
COPY ./build/  /usr/share/nginx/html/manage/
COPY ./nginx.conf /etc/nginx/nginx.conf