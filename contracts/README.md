To flatten:
1.
```
npm install
```
2.
```
 ./node_modules/.bin/truffle-flattener contracts/EternalStorageProxyForStormMultisender.sol > flats/EternalStorageProxyForStormMultisender_flat.sol
 ./node_modules/.bin/truffle-flattener contracts/multisender/UpgradebleStormSender.sol > flats/UpgradebleStormSender_flat.sol
```