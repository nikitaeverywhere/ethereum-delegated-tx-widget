import { observe, action, runInAction, toJS } from 'mobx';
import { WARNING_BACK_END_ERROR } from '../../const';
import { getBackEndContracts, httpPost } from '../../utils';
import state from '../state';

let backEndRequested = false;
let lastBackEndRequestId = 0;

const requestBackEnd = action(async () => {
  // Ignore if request is already made or there are any warning messages
  if (!!state.warningMessageReadOnly || backEndRequested) {
    return;
  }

  backEndRequested = true;
  const backEndRequestId = ++lastBackEndRequestId;

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
          from: state.currentEthereumAccount,
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
        console.warn(
          `Weird back end ${meta.url} response, ${JSON.stringify(res)}`
        );
        return null;
      }
      return [res.request, meta];
    })
  )).filter(r => !!r);

  if (lastBackEndRequestId !== backEndRequestId) {
    return; // Prevent concurrent requests
  }

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

const clearAndRequest = action(() => {
  backEndRequested = false;
  if (state.backendWarningMessage) {
    state.backendWarningMessage = null;
  }
  if (state.approvedDelegationRequest) {
    state.approvedDelegationRequest = null;
  }
  requestBackEnd();
});

observe(state, 'warningMessageReadOnly', requestBackEnd);
observe(state, 'contractAddress', clearAndRequest);
observe(state, 'currentEthereumAccount', clearAndRequest);
observe(state, 'functionArguments', clearAndRequest);
