#!/bin/sh

CONF_PATH=/etc/traefik/traefik.yml

CERT_TYPE=staging

CERT_PATH_STAGING=/etc/traefik/acmeStaging.json
CERT_PATH_PRODUCTION=/etc/traefik/acmeProduction.json

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
  filePath: /etc/traefik/accessLog.json
  format: json

log:
  level: DEBUG
  filePath: /etc/traefik/log.json
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
      rule: "Host(\`$BASE_DOMAIN\`) && PathPrefix(\`/api/\`)"
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
    directory: /etc/traefik
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
  filePath: /etc/traefik/accessLog.json
  format: json

log:
  level: DEBUG
  filePath: /etc/traefik/log.json
  format: json

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - "/api"
  routers:
    api:
      rule: "PathPrefix(\`/api/\`)"
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
    directory: /etc/traefik
    watch: true
EOF
fi