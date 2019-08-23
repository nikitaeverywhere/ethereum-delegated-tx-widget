import { observe, action, runInAction } from 'mobx';
import { utils } from 'ethers';
import { ethCall } from '../utils';
import state from './state';

observe(
  state,
  'contractAddress',
  action(async () => {
    const networkName =
      state.targetNetwork.name === 'homestead'
        ? 'mainnet'
        : state.targetNetwork.name;
    try {
      const [symbol, decimals] = await Promise.all([
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
      console.error('Unable to determine token symbol', e);
    }
  })
);
