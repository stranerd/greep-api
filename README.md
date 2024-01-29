# Greep

## Development

Software requirements

- docker/docker-compose
- git
- make
- node/npm/npx

<br>

## Setup

```bash
# clone project
$ git clone https://github.com/stranerd/greep-api

# setup git hooks
$ npx husky install

# create symbolic links for common types
$ make link-commons

# install dependencies for all ervices
$ make install-all

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

```bash
# create synthetic.conf file
touch /etc/synthetic.conf

# change permissions of synthetic to public
chmod 0666 /etc/synthetic.conf

# add content to synthetic.conf
echo "c   Users/{YOUR_MAC_USER_NAME}/doc-data/c" >> /etc/synthetic.conf
# the first path of the comman "c" is the name of the symlinked folder on the root
# the second path is the name of the actual place the folder will be.. You can use any regular path for this
# NB: the separator between the first and second path is a tab.. Make sure it is a tab and not spaces, or this wont work

# reboot your system for the changes to take effect
reboot
```

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
$ make lint-all
```
