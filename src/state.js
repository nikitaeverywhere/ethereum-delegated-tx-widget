import { observable } from 'mobx';

export const unknownNetwork = Object.freeze({
  chainId: -1,
  name: 'unknown-network'
});

const state = observable({
  currentEthereumAccount: '',
  currentNetwork: unknownNetwork
});

export default state;
