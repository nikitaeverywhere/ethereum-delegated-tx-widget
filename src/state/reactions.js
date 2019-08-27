import { observe, action, runInAction } from 'mobx';
import { utils } from 'ethers';
import { ethCall } from '../utils';
import state from './state';

const loadTokenMeta = action(async () => {
  const networkName =
    state.targetNetwork.name === 'homestead'
      ? 'mainnet'
      : state.targetNetwork.name;
  let symbol, decimals;
  try {
    [symbol, decimals] = await Promise.all([
      ethCall(networkName, state.contractAddress, 'symbol()'),
      ethCall(networkName, state.contractAddress, 'decimals()')
    ]);
    runInAction(() => {
      state.contractSymbolReadOnly = utils.parseBytes32String(
        '0x' + symbol.substr(64 * 2 + 2, 64 * 2 + 2 + 64)
      );
      state.contractDecimalsReadOnly = parseInt(decimals);
    });
  } catch (e) {
    runInAction(() => {
      state.contractSymbolReadOnly = 'Tokens';
      state.contractDecimalsReadOnly = 18;
    });
    if (symbol !== '0x') {
      console.info('Unable to determine token symbol', e);
    } // Otherwise it is not present in the network and it's fine
  }
});

observe(state, 'contractAddress', loadTokenMeta); // Todo: kovan token meta
observe(state, 'targetNetwork', loadTokenMeta);
// observe(state, 'warningMessageReadOnly', () => console.log('Warning message changes'));
