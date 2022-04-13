#!/bin/sh

CONF_PATH=/data/docker/grip/traefik/traefik.yml

CERT_TYPE=staging

CERT_PATH_STAGING=/data/docker/grip/traefik/acmeStaging.json
CERT_PATH_PRODUCTION=/data/docker/grip/traefik/acmeProduction.json

if [ "$USE_SSL" = 1 ]; then
cat > $CONF_PATH <<- EOF
global:
  checkNewVersion: true
  sendAnonymousUsage: false

entryPoints:
  web:
    address: :80

  websecure:
    address: :443

accessLog:
  filePath: /data/docker/grip/traefik/accessLog.json
  format: json

log:
  level: DEBUG
  filePath: /data/docker/grip/traefik/log.json
  format: json

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - "/api"
  routers:
    api:
      tls:
        certresolver: $CERT_TYPE
      rule: "Host(\`$BASE_DOMAIN\`) && PathPrefix(\`/\`)"
      middlewares:
        - stripRoutePrefix
      service: api

  services:
    api:
      loadBalancer:
        servers:
          - url: http://api:8080/

api:
  insecure: true
  dashboard: true

providers:
  file:
    directory: /data/docker/grip/traefik
    watch: true

certificatesResolvers:
  staging:
    acme:
      email: kevin@stranerd.com
      storage: $CERT_PATH_STAGING
      caServer: "https://acme-staging-v02.api.letsencrypt.org/directory"
      httpChallenge:
        entryPoint: web

  production:
    acme:
      email: kevin@stranerd.com
      storage: $CERT_PATH_PRODUCTION
      caServer: "https://acme-v02.api.letsencrypt.org/directory"
      httpChallenge:
        entryPoint: web
EOF
else
cat > $CONF_PATH <<- EOF
global:
  checkNewVersion: true
  sendAnonymousUsage: false

entryPoints:
  web:
    address: :80

accessLog:
  filePath: /data/docker/grip/traefik/accessLog.json
  format: json

log:
  level: DEBUG
  filePath: /data/docker/grip/traefik/log.json
  format: json

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - "/api"
  routers:
    api:
      rule: "PathPrefix(\`/\`)"
      middlewares:
        - stripRoutePrefix
      service: api

  services:
    api:
      loadBalancer:
        servers:
          - url: http://api:8080/

api:
  insecure: true
  dashboard: true

providers:
  file:
    directory: /data/docker/grip/traefik
    watch: true
EOF
fi