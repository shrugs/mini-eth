#!/bin/bash

docker run --name mini-eth --rm \
    -v `pwd`/cache:/root/datadir \
    -p 8545:8545 \
    ethereum/client-go \
    --datadir=/root/datadir \
    --dev --dev.period 1 \
    --targetgaslimit 8000000 \
    --rpc --rpcapi "eth,web3,personal,net" \
    --rpcport 8545 --rpccorsdomain "*" --rpcaddr "0.0.0.0" \
    --rpcvhosts "*" \
    --verbosity 3

