# supply-logistics-demo

> A simple demo shows how to use SIMBA API to post and get info to/from a private blockchain(Circle of Life).An Ethereum account is auto generated and Ethers are auto deposited, if no wallet is detected on user's browser under this domain. This demo auto signs the transaction with your Ethereum account when a post being made. 


## Build Setup

``` bash
# install dependencies
npm install

# create and configure an app on Simba Dashboard 
# with the `supply-logistics-demo.sol` smart contract
# at https://app.simbachain.com/

# generate APIKEYs on `App-View` page for SIMBA-API and Configuration(management) API

# open src/components/gateways/simba-api.js, replace `baseURL` and `APIKEY` with yours

# open src/components/gateways/manage-api.js, replace `APIKEY` with yours

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## What you can find out from this demo

1. How to create/restore an Ethereum account and save it into browser's localstorage 
2. How to deposit Ethers to an Ethereum account on a private blockchain with Configuration(management) API
2. How to use SIMBA API to post information/file to a private blockchain
3. How to use SIMBA API to retreive information/file from a private blockchain
4. How to use SIMBA API to query transcations with different serach conditions
