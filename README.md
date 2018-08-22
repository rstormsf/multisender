![Demo](demo.gif)
# Problem:
Previously in Ethereum Network, additional tools were required in order to transfer many ERC20 tokens at once.
Many people still do this manually, one transaction at a time. This process is time consuming and prone to an error.

# Solution:
This Dapp allows a user to send thousands of token transfers in a very effecient way by batching them in groups of 145 token transfers per Ethereum transaction. This automation saves time by automatically generating transactions to MetaMask. Finally, this tool allows a user to maintain security of their account by delegating the trust of their private keys to a secure MetaMask wallet.

# How to use:
1. Install [Metamask](https://metamask.io).
2. Make sure you have an account in MetaMask which has a token balance.
3. Make sure your MetaMask is pointed to the network that you would like to use.
4. Make sure your MetaMask account is unlocked.
5. Go to https://rstormsf.github.io/multisender/#/
6. Wait for the full page to load.
7. Select a token from the dropdown that you would like to send.
8. Provide either JSON or CSV text in the textarea (see example below).
9. Click next.
10. If everything looks good, click next once again.
11. Wait for MetaMask to generate an approval transaction.
12. Once the approval transaction is mined, MetaMask will generate as many transactions as needed for your token transfers (145 addresses per tx).
13. Done!

You can test this tool on any test network, if you want to make sure that
everything will work as expected.

Contracts deployed:  
Mainnet, Rinkeby, Kovan, Ropsten, Sokol, CORE-POA:  
ProxyStorage: 0xa5025faba6e70b84f74e9b1113e5f7f4e7f4859f  
Implementation: 0x97f76edb9d631590558b5c23f27a2a4711c0c964  

Example JSON:
```json

[
  {"0xCBA5018De6b2b6F89d84A1F5A68953f07554765e":"12"},
  {"0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9":"1123.45645"},
  {"0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae":"1.049"},
  {"0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774":"14546"}
]
```
Example CSV:
```csv
0xCBA5018De6b2b6F89d84A1F5A68953f07554765e,12
0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9,1123.45645
0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae,1.049
0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774,14546
```
```
Proof of work:
https://etherscan.io/tx/0x2fd09c03609f3f34a326983f1c685ea1bcb87dfcaabc12932dbe38d2c453f2c8
https://kovan.etherscan.io/tx/0x755b84a8a61fd82c1410f6bbbb452c94ddf12fac5b1daaa1496671bcd6e21882

```

# How to setup dev environment

1. git clone git@github.com:rstormsf/multisender.git
2. cd contracts
3. I used  `node -v v9.7.1`
4. npm install
5. deploy MultiSender contract OR use existing deployed version: 0xa5025faba6e70b84f74e9b1113e5f7f4e7f4859f
currenty deployed on Kovan, Rinkeby, Ropsten, POA-network, POA-Sokol, Mainnet
Instructions on how to deploy it is listed below.
6. cd ..
7. npm install
8. cp .env.example .env
9. open .env file and provide an address of multisender contract
10. npm run start

# Contract Deployment

There are 2 ways to deploy the contracts: Upgradable and non-upgradable way.
Non-upgrdable:
 - cd contracts
 - npm run flatten
 - take `flats/UpgradebleStormSender_flat.sol` and deploy it using https://remix.ethereum.org/
   - select solidity 0.4.23 version in settings
 - once deployed, call `initialize` function with parameter address of owner's contract

# Disclaimer
This tool is not affiliated with https://poa.network
This is a personal project of Roman Storm.

He is not responsible for any loss from transactions derived by MultiSender.  Some of the underlying JavaScript libraries and Ethereum tools that were used are under active development. The website and smart contract has been thoroughly tested, there is always the possibility something unexpected happens resulting in losses of Ethereum and/or tokens.

Any ERC20 tokens you transfer to the Multisender will be sent out to the addresses that you provided.

The smart contract source code can be audited by anyone in this repository.

I encourage you to assess its security before using the Mutlisender Dapp.