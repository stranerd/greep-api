APPS = api
ALL_FOLDERS = ${APPS}
args = $(filter-out $@,$(MAKECMDGOALS))

make-acme:
	mkdir -p /etc/traefik && touch /etc/traefik/acmeStaging.json /etc/traefik/acmeProduction.json /etc/traefik/accessLog.json /etc/traefik/log.json && chmod 600 /etc/traefik/acme*.json

dev-start:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build --remove-orphans;

dev-start-detach:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d --remove-orphans;

dev-stop:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans;

dev-watch-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f;

prod-build:
	docker-compose -f docker-compose.yml build;

prod-start:
	docker-compose -f docker-compose.yml up --remove-orphans;

prod-start-detach:
	docker-compose -f docker-compose.yml up -d --remove-orphans;

prod-stop:
	docker-compose -f docker-compose.yml down --remove-orphans;

prod-watch-logs:
	docker-compose -f docker-compose.yml logs -f;

install-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) &&) echo

lint-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) lint &&) echo

build-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) build &&) echo

copy-envs:
	node bin/copy-envs.js $(APPS);
