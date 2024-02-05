# DO-NOT EDIT THIS FILE!!!

# create synthetic.conf file
touch /etc/synthetic.conf

# change permissions of synthetic to public
chmod 0666 /etc/synthetic.conf

mkdir -p /Users/$(whoami)/doc-data/c

# add content to synthetic.conf
echo "c	Users/$(whoami)/doc-data/c" >> /etc/synthetic.conf
# the first path of the comman "c" is the name of the symlinked folder on the root
# the second path is the name of the actual place the folder will be.. You can use any regular path for this
# NB: the separator between the first and second path is a tab.. Make sure it is a tab and not spaces, or this wont work

# reboot your system for the changes to take effect
reboot