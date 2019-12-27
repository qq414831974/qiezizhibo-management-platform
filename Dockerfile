FROM nginx
MAINTAINER wufan
RUN mkdir -p /usr/share/nginx/html/manage/ \
	&& mkdir -p /data/ssl
COPY ./build/  /usr/share/nginx/html/manage/
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./ssl/www_xiaoyuanzuqiu_live/ /data/ssl/
RUN echo 'successed'