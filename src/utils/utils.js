const { Script, Address } = require('@xazab/xazabcore-lib');
const { DUFFS_PER_XAZAB } = require('../CONSTANTS');

function xazabToDuffs(xazab) {
  if (xazab === undefined || xazab.constructor.name !== Number.name) {
    throw new Error('Can only convert a number');
  }
  return parseInt((xazab * DUFFS_PER_XAZAB).toFixed(0), 10);
}
function duffsToXazab(duffs) {
  if (duffs === undefined || duffs.constructor.name !== Number.name) {
    throw new Error('Can only convert a number');
  }
  return duffs / DUFFS_PER_XAZAB;
}
function hasProp(obj, prop) {
  if (!obj) return false;
  if (Array.isArray(obj)) {
    return obj.includes(prop);
  }
  return {}.hasOwnProperty.call(obj, prop);
}
function getBytesOf(elem, type) {
  let BASE_BYTES = 0;
  let SCRIPT_BYTES = 0;

  switch (type) {
    case 'utxo':
      BASE_BYTES = 32 + 4 + 1 + 4;
      SCRIPT_BYTES = Buffer.from(elem.script, 'hex').length;
      return BASE_BYTES + SCRIPT_BYTES;
    case 'output':
      BASE_BYTES = 8 + 1;
      SCRIPT_BYTES = Script(new Address(elem.address)).toBuffer().length;
      return BASE_BYTES + SCRIPT_BYTES;
    default:
      return false;
  }
}
module.exports = {
  xazabToDuffs, duffsToXazab, getBytesOf, hasProp,
};
