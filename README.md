# Greep

## Development

Software requirements

- docker/docker-compose
- git
- make
- node/pnpm

<br>

## Setup

```bash
# clone project
$ git clone https://github.com/stranerd/greep-api

# create symbolic links for common types
$ make link-commons

# install dependencies for all services
$ pnpm i

# copy env.example.json to env.json & fill in all env values in env.json or reach out to admin to get a valid set on environment values
$ cp env.example.json env.json
```

<br>

## Run project

Running the project with the command below mounts the data created in some docker containers(mongodb, kafka, redis) to some directory on your pc.
To ensure the same folder is always used, we use hardocoded paths `/c/data/docker/greep/`

For users running windows or linux, these work fine, because

- 99% of Windows machines have a C drive, which can be accessed by /c/
- Linux systems dont have a c drive, but linux systems allow scripts to create folders on the root, so `/c/` folder can be created easily by the script

However, MacOS is a different tale. MacOS is similar to linux, but they make the root folder readonly by default so that our script cannot create the `/c/` folder

To bypass this, we can create a folder anywhere in our system and create a symlink to the folder on the root named 'c'
<https://apple.stackexchange.com/questions/388236/unable-to-create-folder-in-root-of-macintosh-hd>
Run the `setup-mac.sh` script in the bin/ folder

## Commands to run project

```bash
# start all containers without detach in dev mode
$ make dev-start

# start all containers in detach mode in dev mode
$ make dev-start-detach

# check logs if started in detach mode
$ make watch-logs

# stop all containers if started in detach mode
$ make dev-stop

# run in production mode in detach
$ make prod-start-detach
```

<br>

## Lint entire codebase

```bash
# ensure all services have a lint script defined in it
$ pnpm lint
```
