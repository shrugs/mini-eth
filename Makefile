SHELL:?/bin/bash

install-docker:
	./bin/install.sh

run:
	./bin/run.sh

deploy:
	node deploy.js

distribute:
	node distribute.js

copy-artifacts:
	cp ../proof-of-work/build/contracts/ProofOfWork.json ./artifacts/ProofOfWork.json
