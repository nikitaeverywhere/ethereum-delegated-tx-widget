import state from './state';
import { action, runInAction } from 'mobx';
import { parse } from 'qs';
import {
  DELEGATED_TX_BACK_ENDS,
  NETWORK_BY_CHAIN_ID,
  UNKNOWN_NETWORK,
  WARNING_WRONG_URL_PARAMETER
} from '../const';
import { httpGet, isValidEthereumAddress, updateUrl } from '../utils';

const url = parse(window.location.search.slice(1));

/// Sync actions:
/// - Parse URL components
/// - Determine target network
action(() => {
  if (url.network) {
    if (url.network === 'mainnet') {
      url.network = 'homestead';
    }
    if (parseInt(url.network) === +url.network) {
      state.targetNetwork = NETWORK_BY_CHAIN_ID[url.network];
    } else {
      state.targetNetwork = Object.values(NETWORK_BY_CHAIN_ID).find(
        net => net.name === url.network
      );
    }
    // If bad network configured
    if (!state.targetNetwork) {
      state.targetNetwork = UNKNOWN_NETWORK;
      state.globalWarningMessage = WARNING_WRONG_URL_PARAMETER(
        'network',
        url.network
      );
    }
  }
  // Keep below network
  if (url.contractAddress) {
    if (isValidEthereumAddress(url.contractAddress)) {
      state.contractAddress = url.contractAddress;
    } else {
      state.globalWarningMessage = WARNING_WRONG_URL_PARAMETER(
        'contractAddress',
        url.contractAddress
      );
    }
  }
  if (url.functionArguments) {
    state.functionArguments = url.functionArguments.split(',');
  }
  updateUrl(state);
})();

/// Fetch back ends metadata
// Because querying back ends can take up to 30 seconds, this function throttles the responses
// and adds them to the state once they are ready.
action(async () => {
  const backEndsReady = [];
  const addBackEnds = () => {
    runInAction(() => {
      let backEnd, url;
      while (([backEnd, url] = backEndsReady.pop() || []) && backEnd) {
        state.backEndsMeta.push(backEnd);
        if (!backEnd.contracts || !(backEnd.contracts instanceof Array)) {
          console.warn(
            `Back end endpoint GET ${url} does not provide contracts[]`
          );
        }
        for (const contractBackEnd of backEnd.contracts || []) {
          state.backEndsByContractReadOnly = {
            ...state.backEndsByContractReadOnly,
            [contractBackEnd.address]: (
              state.backEndsByContractReadOnly[contractBackEnd.address] || []
            ).concat({
              ...contractBackEnd,
              url,
              networkChainId: backEnd.networkChainId,
              networkName: backEnd.networkName
            })
          };
        }
      }
    });
  };
  const interval = setInterval(addBackEnds, 250);
  await Promise.all(
    DELEGATED_TX_BACK_ENDS.map(async url => {
      url = await url; // Resolve promises
      try {
        const meta = await httpGet(url);
        backEndsReady.push([meta, url]);
      } catch (e) {
        console.error(`Back end ${url} responds with error.`, e);
      }
    })
  );
  // Clear the interval once all back ends are loaded
  clearInterval(interval);
  addBackEnds();
})();
