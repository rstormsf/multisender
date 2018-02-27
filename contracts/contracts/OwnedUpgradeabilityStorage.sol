// Roman Storm Multi Sender
// To Use this Dapp: https://poanetwork.github.io/multisender
pragma solidity 0.4.19;

import "./EternalStorage.sol";
import "./UpgradeabilityStorage.sol";
import "./UpgradeabilityOwnerStorage.sol";


/**
 * @title OwnedUpgradeabilityStorage
 * @dev This is the storage necessary to perform upgradeable contracts.
 * This means, required state variables for upgradeability purpose and eternal storage per se.
 */
contract OwnedUpgradeabilityStorage is UpgradeabilityOwnerStorage, UpgradeabilityStorage, EternalStorage {}