const WalletLibError = require('./WalletLibError');

class InvalidXazabcoreTransaction extends WalletLibError {
  constructor(tx, reason = 'A Xazabcore Transaction object or valid rawTransaction is required') {
    super(`${reason}: ${tx.toString()}`);
  }
}

module.exports = InvalidXazabcoreTransaction;
