import { observe, action } from 'mobx';
import state from '../state';

observe(
  state,
  'selectedNetwork',
  action(() => {
    state.selectedNetworkNameReadOnly =
      state.selectedNetwork.name === 'homestead'
        ? 'mainnet'
        : state.selectedNetwork.name;
  })
);
