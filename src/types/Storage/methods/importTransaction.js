const { Transaction } = require('@xazab/xazabcore-lib');
const { Output } = Transaction;
const { InvalidXazabcoreTransaction } = require('../../../errors');
const { FETCHED_CONFIRMED_TRANSACTION } = require('../../../EVENTS');

const parseStringifiedTransaction = (stringified) => new Transaction(stringified);
/**
 * This method is used to import a transaction in Store.
 * @param {Transaction/String} transaction - A valid Transaction
 * @return void
 */
const importTransaction = function importTransaction(transaction) {
  if (!(transaction instanceof Transaction)) {
    try {
      // eslint-disable-next-line no-param-reassign
      transaction = parseStringifiedTransaction(transaction);
      if (!transaction.hash || !transaction.inputs.length || !transaction.outputs.length) {
        throw new InvalidXazabcoreTransaction(transaction);
      }
    } catch (e) {
      throw new InvalidXazabcoreTransaction(transaction);
    }
  }
  const { store, network, mappedAddress } = this;
  const { transactions } = store;
  const { inputs, outputs } = transaction;

  let hasUpdateStorage = false;
  let outputIndex = -1;
  const processedAddressesForTx = {};

  // If we already had this transaction locally, we won't add it again,
  // but we still need to continue processing it as we might have new
  // address generated (on BIP44 wallets) since the first checkup.
  if (!transactions[transaction.hash]) {
    transactions[transaction.hash] = transaction;
  }

  [...inputs, ...outputs].forEach((element) => {
    const isOutput = (element instanceof Output);
    if (isOutput) outputIndex += 1;

    if (element.script) {
      const address = element.script.toAddress(network).toString();

      if (mappedAddress && mappedAddress[address]) {
        const { path, type, walletId } = mappedAddress[address];
        const addressObject = store.wallets[walletId].addresses[type][path];
        // If the transactions has already been processed in a previous insertion,
        // we can skip the processing now
        if (addressObject.transactions.includes(transaction.hash)) {
          return;
        }

        if (!addressObject.used) addressObject.used = true;

        // We mark our address as affected so we update the tx later on
        if (!processedAddressesForTx[addressObject.address]) {
          processedAddressesForTx[addressObject.address] = addressObject;
        }

        if (!isOutput) {
          const vin = element;
          const utxoKey = `${vin.prevTxId.toString('hex')}-${vin.outputIndex}`;
          if (addressObject.utxos[utxoKey]) {
            const previousOutput = addressObject.utxos[utxoKey];
            addressObject.balanceSat -= previousOutput.satoshis;
            delete addressObject.utxos[utxoKey];
            hasUpdateStorage = true;
          }
        } else {
          const vout = element;

          const utxoKey = `${transaction.hash}-${outputIndex}`;
          if (!addressObject.utxos[utxoKey]) {
            addressObject.utxos[utxoKey] = vout;
            addressObject.balanceSat += vout.satoshis;
            hasUpdateStorage = true;
          }
        }
      }
    }
  });

  // As the same address can have one or more inputs and one or more outputs in the same tx
  // we update it's transactions array as last step of importing
  Object.values(processedAddressesForTx).forEach((addressObject) => {
    addressObject.transactions.push(transaction.hash);
  });

  if (hasUpdateStorage) {
    this.lastModified = +new Date();
    // Announce only confirmed transaction imported that are our.
    this.announce(FETCHED_CONFIRMED_TRANSACTION, { transaction });
  }
};
module.exports = importTransaction;
