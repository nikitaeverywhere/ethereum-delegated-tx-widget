import { observe } from 'mobx';
import state from '../state';
import { updateUrl } from '../../utils';

const observeProps = [
  'contractAddress',
  'functionName',
  'functionArguments',
  'fixed',
  'customBackEndsList',
  'successRedirectUrl'
];

observeProps.forEach(prop => observe(state, prop, () => updateUrl(state)));
