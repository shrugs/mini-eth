SHELL:?/bin/bash

install-docker:
	./bin/install.sh

run:
	./bin/run.sh

distribute:
	node distribute.js
