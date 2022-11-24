# https 설정
FROM nginx:latest

COPY ./ssl /etc/ssl
COPY ./ssl/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx","-g","daemon off;"]