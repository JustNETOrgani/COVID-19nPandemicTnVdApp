# covidtnvdapp
A secured blockchain-based system for persons to prove their COVID-19 test/vaccination status while strictly enforcing privacy.
The Smart Contract that underpines the platform is located in src/assets/smart_contract directory.

Instructions to run locally:

Run a local instance of Ethereum blockchain using for example Ganache-cli.
Compile and deploy JPBlock smart contract via Remix IDE.
Install Metamask browser extension for wallet functionality.
Update "contractAddress" within the contractABI.js file (inside src/assets/js directory) file used by the DApp.
Run "npm install" in the main directory of the project to install all dependencies.
Run "npm run serve" to run the DApp on localhost.
Access the DApp's UI in the browser via localhost to interact with it.
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
