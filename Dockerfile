FROM nginx
MAINTAINER wufan
RUN mkdir -p /usr/share/nginx/html/manage/ \
	&& mkdir -p /data/ssl
COPY ./build/  /usr/share/nginx/html/manage/
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl/www_qiezizhibo_com/ /data/ssl/
RUN echo 'successed'