FROM nginx:1.25.1

RUN addgroup --gid 1000 mygroup
RUN adduser --system --no-create-home --disabled-password --disabled-login --uid 1000 --ingroup mygroup myuser

WORKDIR /var

RUN chown -R myuser:mygroup .

USER myuser

COPY cert.pem /etc/nginx/certs/wscnettie.com/cert.pem
COPY key.pem /etc/nginx/certs/wscnettie.com/key.pem
COPY ./default.conf /etc/nginx/conf.d/default.conf
