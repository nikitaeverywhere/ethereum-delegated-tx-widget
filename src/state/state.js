import { observable } from 'mobx';
import { UNKNOWN_NETWORK, NETWORK_BY_CHAIN_ID } from '../const';

const state = observable({
  globalWarningMessage: null, // React component displayed on top of all other warnings if set

  currentEthereumAccount: '',
  targetNetwork: NETWORK_BY_CHAIN_ID[1], // Default to mainnet
  selectedNetwork: UNKNOWN_NETWORK, // Network currently selected by user

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
