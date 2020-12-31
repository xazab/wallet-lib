const Xazabcore = require('@xazab/xazabcore-lib');
const { is } = require('../../../utils');
const {
  ValidTransportLayerRequired,
  InvalidRawTransaction,
  InvalidXazabcoreTransaction,
} = require('../../../errors');

function impactAffectedInputs({ inputs }) {
  const {
    storage, walletId,
  } = this;

  // We iterate out input to substract their balance.
  inputs.forEach((input) => {
    const potentiallySelectedAddresses = storage.searchAddressesWithTx(input.prevTxId);
    // Fixme : If you want this check, you will need to modify fixtures of our tests.
    // if (!potentiallySelectedAddresses.found) {
    //   throw new Error('Input is not part of that Wallet.');
    // }
    potentiallySelectedAddresses.results.forEach((potentiallySelectedAddress) => {
      const { type, path } = potentiallySelectedAddress;
      if (potentiallySelectedAddress.utxos[`${input.prevTxId}-${input.outputIndex}`]) {
        const inputUTXO = potentiallySelectedAddress.utxos[`${input.prevTxId}-${input.outputIndex}`];
        const address = storage.store.wallets[walletId].addresses[type][path];
        // Todo: This modify the balance of an address, we need a std method to do that instead.
        address.balanceSat -= inputUTXO.satoshis;
        delete address.utxos[`${input.prevTxId}-${input.outputIndex}`];
      }
    });
  });

  return true;
}

/**
 * Broadcast a Transaction to the transport layer
 * @param {Transaction|RawTransaction} transaction - A txobject or it's hexadecimal representation
 * @return {Promise<transactionId>}
 */
async function broadcastTransaction(transaction) {
  if (!this.transport) throw new ValidTransportLayerRequired('broadcast');

  // We still support having in rawtransaction, if this is the case
  // we first need to reform our object
  if (is.string(transaction)) {
    const rawtx = transaction.toString();
    if (!is.rawtx(rawtx)) throw new InvalidRawTransaction(rawtx);
    return broadcastTransaction.call(this, new Xazabcore.Transaction(rawtx));
  }

  if (!is.xazabcoreTransaction(transaction)) {
    throw new InvalidXazabcoreTransaction(transaction);
  }

  if (!transaction.isFullySigned()) {
    throw new Error('Transaction not signed.');
  }
  const txid = await this.transport.sendTransaction(transaction.toString());
  // We now need to impact/update our affected inputs
  // so we clear them out from UTXOset.
  const { inputs } = new Xazabcore.Transaction(transaction).toObject();
  impactAffectedInputs.call(this, {
    inputs,
  });

  return txid;
}

module.exports = broadcastTransaction;
