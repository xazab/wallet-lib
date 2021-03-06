const { Block } = require('@xazab/xazabcore-lib');
const logger = require('../../../logger');

module.exports = async function getBlockByHash(blockHash) {
  logger.silly(`DAPIClient.getBlockByHash[${blockHash}]`);

  return new Block(await this.client.core.getBlockByHash(blockHash));
};
