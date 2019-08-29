import { action } from 'mobx';

export const getBackEndContracts = state =>
  (state.backEndsByContractReadOnly[state.contractAddress] &&
    state.backEndsByContractReadOnly[state.contractAddress].length &&
    state.backEndsByContractReadOnly[state.contractAddress].filter(
      b => b.networkChainId === state.selectedNetwork.chainId
    )) ||
  [];

export const updateUrl = action(state => {
  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}?contractAddress=${
      state.contractAddress
    }&functionName=${
      state.functionName
    }&functionArguments=${state.functionArguments.join(',')}${
      state.fixed ? '&fixed' : ''
    }`
  );
});
