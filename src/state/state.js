import { observable } from 'mobx';
import {
  UNKNOWN_NETWORK,
  NETWORK_BY_CHAIN_ID,
  WARNING_NO_WEB3,
  WARNING_CONTRACT_NOT_SUPPORTED,
  WARNING_SUPPORTED_CONTRACT_WRONG_NETWORK
} from '../const';

const state = observable({
  currentEthereumAccount: '',
  targetNetwork: NETWORK_BY_CHAIN_ID[1], // Default to mainnet
  selectedNetwork: UNKNOWN_NETWORK, // Network currently selected by user

  globalWarningMessage: null, // Displayed on top of all other warnings if set
  initWarningMessage: WARNING_NO_WEB3,
  networkWarningMessage: null,
  // Refer to this property to understand whether there are any warning messages
  get warningMessageReadOnly() {
    return (
      state.globalWarningMessage ||
      state.initWarningMessage ||
      state.networkWarningMessage ||
      (!state.backEndsByContractReadOnly[state.contractAddress] &&
        WARNING_CONTRACT_NOT_SUPPORTED(state.contractAddress)) ||
      (!state.backEndsByContractReadOnly[state.contractAddress].find(
        b => b.networkChainId === state.selectedNetwork.chainId
      ) && // Nado eshe podymat'
        WARNING_SUPPORTED_CONTRACT_WRONG_NETWORK(
          state.selectedNetwork.name,
          Array.from(
            new Set(
              state.backEndsByContractReadOnly[state.contractAddress].map(
                c => c.networkName
              )
            )
          )
        ))
    );
  },

  contractAddress: '0x82f4ded9cec9b5750fbff5c2185aee35afc16587',
  contractSymbolReadOnly: 'DREAM', // Updates automatically once `contractAddress` changes
  contractDecimalsReadOnly: 6, // Updates automatically once `contractAddress` changes
  functionName: 'transfer',
  functionArguments: ['0xB3311c91d7c1B305DA3567C2320B716B13F24F8A', '9990000'],

  backEndsMeta: [], // Metadata of all back ends collected from root endpoint. See ./init
  backEndsByContractReadOnly: {} // Map contract => [back end 1, back end 2, ...]. Computed within backEndsMeta
});

console.log('state', state);

export default state;
