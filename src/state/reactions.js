import { observe, action, runInAction, toJS } from 'mobx';
import { utils } from 'ethers';
import {
  WARNING_BACK_END_ERROR,
  WARNING_BACK_END_INVALID_RESPONSE
} from '../const';
import { ethCall, getBackEndContracts, httpPost } from '../utils';
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

let backEndRequested = false;
observe(state, 'contractAddress', () => (backEndRequested = false));
observe(state, 'warningMessageReadOnly', async () => {
  // Ignore if request is already made or there are any warning messages
  if (!!state.warningMessageReadOnly || backEndRequested) {
    return;
  }

  backEndRequested = true;

  // Request back end
  let backEndErrors = [];
  const responses = (await Promise.all(
    getBackEndContracts(state).map(async meta => {
      if (
        !meta ||
        !meta.url ||
        !meta.functions ||
        !meta.functions.find(f => f.name === state.functionName)
      ) {
        console.warn(
          `Weird back end ${meta.url}, ${JSON.stringify(meta, null, 4)}`
        );
        return null; // Invalid back end
      }
      let res;
      try {
        res = await httpPost(`${meta.url}/request`, {
          contractAddress: state.contractAddress,
          signer: state.currentEthereumAccount,
          functionName: state.functionName,
          functionArguments: state.functionArguments
        });
      } catch (e) {
        backEndErrors.push([meta.url, e]);
        console.warn(`Weird back end, POST ${meta.url}/request:`, e);
        return null;
      }
      if (
        !res ||
        !res.request ||
        !res.request.id ||
        !(res.request.signatureOptions instanceof Array) ||
        res.request.signatureOptions.length === 0
      ) {
        runInAction(
          () =>
            (state.backendWarningMessage = WARNING_BACK_END_INVALID_RESPONSE(
              meta.url,
              JSON.stringify(res)
            ))
        );
        return null;
      }
      return [res.request, meta];
    })
  )).filter(r => !!r);

  if (
    (backEndErrors.length > 0 && !state.backendWarningMessage) ||
    responses.length === 0
  ) {
    runInAction(() => {
      const [url, e] =
        backEndErrors.length > 0 ? backEndErrors[0] : ['*', 'silence'];
      state.backendWarningMessage = WARNING_BACK_END_ERROR(url, e.toString());
    });
    return;
  }

  const bestBackEnd = responses.reduce(
    (best, be) => (be[0].fee < best[0].fee ? be : best),
    responses[0]
  );

  runInAction(() => {
    if (state.backendWarningMessage) {
      state.backendWarningMessage = null;
    }
    if (bestBackEnd) {
      state.approvedDelegationRequest = Object.assign(bestBackEnd[0], {
        meta: toJS(bestBackEnd[1])
      });
    }
  });
});
