const Xazabcore = require('@xazab/xazabcore-lib');

module.exports = function getNetwork(network) {
  return Xazabcore.Networks[network].toString() || Xazabcore.Networks.testnet.toString();
};
