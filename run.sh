mkdir /usr/local/nginx/log -p

docker run --name qiezizhibo-manage -d -p 8081:8081 -v /usr/local/nginx/log:/var/log/nginx qiezitv/qiezizhibo-manage:20221215
