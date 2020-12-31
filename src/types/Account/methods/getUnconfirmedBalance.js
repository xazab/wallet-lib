const { duffsToXazab } = require('../../../utils');

/**
 * Return the total balance of unconfirmed utxo
 * @param displayDuffs {boolean} True by default. Set the returned format : Duff/xazab.
 * @return {number} Balance in xazab
 */
function getUnconfirmedBalance(displayDuffs = true) {
  const {
    walletId, storage,
  } = this;
  const accountIndex = this.index;

  const totalSat = storage.calculateDuffBalance(walletId, accountIndex, 'unconfirmed');
  return (displayDuffs) ? totalSat : duffsToXazab(totalSat);
}

module.exports = getUnconfirmedBalance;
