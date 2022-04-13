FROM traefik:latest

ARG BASE_DOMAIN
ARG USE_SSL
ENV BASE_DOMAIN $BASE_DOMAIN
ENV USE_SSL $USE_SSL

COPY ./generate-conf.sh /data/docker/grip/traefik/generate-conf.sh
RUN sh /data/docker/grip/traefik/generate-conf.sh