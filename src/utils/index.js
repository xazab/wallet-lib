const { varIntSizeBytesFromLength } = require('./varInt');
const {
  xazabToDuffs,
  duffsToXazab,
  getBytesOf,
  hasProp,
} = require('./utils');
const {
  generateNewMnemonic,
  mnemonicToHDPrivateKey,
  mnemonicToWalletId,
  seedToHDPrivateKey,
  mnemonicToSeed,
} = require('./mnemonic.js');
const is = require('./is');
const coinSelection = require('./coinSelection');
const feeCalculation = require('./feeCalculation');
const { hash, doubleSha256, sha256 } = require('./crypto');

const fundWallet = require('./fundWallet');

module.exports = {
  xazabToDuffs,
  duffsToXazab,
  generateNewMnemonic,
  mnemonicToHDPrivateKey,
  mnemonicToWalletId,
  mnemonicToSeed,
  seedToHDPrivateKey,
  is,
  coinSelection,
  feeCalculation,
  varIntSizeBytesFromLength,
  getBytesOf,
  hash,
  doubleSha256,
  sha256,
  hasProp,
  fundWallet,
};
