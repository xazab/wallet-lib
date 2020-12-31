const { duffsToXazab } = require('../../../utils');

/**
 * Return the total balance of an account (confirmed + unconfirmed).
 * @param displayDuffs {boolean} True by default. Set the returned format : Duff/xazab.
 * @return {number} Balance in xazab
 */
function getTotalBalance(displayDuffs = true) {
  const {
    walletId, storage, index,
  } = this;
  const totalSat = storage.calculateDuffBalance(walletId, index, 'total');
  return (displayDuffs) ? totalSat : duffsToXazab(totalSat);
}

module.exports = getTotalBalance;
