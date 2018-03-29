![Demo](demo.gif)
# Problem:
In ethereum network, additional tools are required in order to send
a lot of ERC20 token transfers.
Many people still do it manually: one transaction  at a time. Hence wasting a lot of Ether on tx fees and manual processing.

# Solution:
This Dapp allows to send thousands of token transfer in very effecient way by batching them by 175 token transfers per eth transaction.
It also saves a lot of human time because it automatically generates transactions to metamask.
This tool also allows to maintain security of your account by delegating the trust of your private keys to a secure metamask wallet.

# How to use:
1. Install [Metamask](https://metamask.io) if you haven't done it already.
2. Make sure you have an account in metamask which has some token balances.
3. Make sure your metamask pointed to a chain that you would like to use.
4. Make sure your metamask account is unlocked.
5. Go to https://poanetwork.github.io/multisender/#/
6. Wait for full page to load
7. Select a token from dropdown that you would like to send
8. Provide either JSON or CSV text in the textarea(See Example below)
9. Click Next
10. If everything looks good, click next
11. Wait for metamask to generate approval transaction
12. Once approval transaction is mined, metamask will generate as much transactions as needed for your token transfers(175 addresses per tx)
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

# Disclaimer
This tool is not affiliated with https://poa.network
It's personal project of Roman Storm

I am not responsible for any loss: MultiSender, and some of the underlying JavaScript libraries and Ethereum tools I use are under active development. While I have thoroughly tested the website and smart-contract, there is always the possibility something unexpected happens resulting in losses of ether or/and tokens.

Any ERC20 tokens you transfer to the Multisender will be sent out to the addresses that you provided.

The smart contract source code could be audited by anyone in this repository

I encourage you to assess its security before using Mutlisender Dapp.