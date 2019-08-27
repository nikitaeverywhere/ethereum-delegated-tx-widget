export const getBackEndContracts = state =>
  (state.backEndsByContractReadOnly[state.contractAddress] &&
    state.backEndsByContractReadOnly[state.contractAddress].length &&
    state.backEndsByContractReadOnly[state.contractAddress].filter(
      b => b.networkChainId === state.selectedNetwork.chainId
    )) ||
  [];
