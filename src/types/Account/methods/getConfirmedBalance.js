const { duffsToXazab } = require('../../../utils');

/**
 * Return the confirmed balance of an account.
 * @param {boolean} [displayDuffs=true] - Set the returned format : Duff/xazab.
 * @return {number} Balance in xazab
 */
function getConfirmedBalance(displayDuffs = true) {
  const {
    walletId, storage,
  } = this;
  const accountIndex = this.index;
  const totalSat = storage.calculateDuffBalance(walletId, accountIndex, 'confirmed');
  return (displayDuffs) ? totalSat : duffsToXazab(totalSat);
}

module.exports = getConfirmedBalance;
