mkdir /usr/local/nginx/log -p

docker run --name nginx -d -p 443:443 -p 80:80 -v /usr/local/nginx/log:/var/log/nginx qiezitv/qiezizhibo-manage:20221129
