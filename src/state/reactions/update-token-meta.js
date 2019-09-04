import { observe, action } from 'mobx';
import state from '../state';

const loadTokenMeta = action(() => {
  const backEnds = state.backEndsByContractReadOnly[state.contractAddress];
  if (!backEnds || backEnds.length === 0 || !backEnds[0].constants) {
    return;
  }
  const constants = backEnds[0].constants;
  state.contractSymbolReadOnly =
    constants.symbol || state.contractSymbolReadOnly;
  state.contractDecimalsReadOnly =
    constants.decimals || state.contractDecimalsReadOnly;
});

observe(state, 'contractAddress', loadTokenMeta);
observe(state, 'backEndsByContractReadOnly', loadTokenMeta);
