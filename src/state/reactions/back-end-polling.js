import { observe, action } from 'mobx';
import {
  WARNING_BACK_END_INVALID_RESPONSE,
  WARNING_TRANSACTION_FAILED,
  INFO_TRANSACTION_MINED,
  INFO_WAIT_FOR_TRANSACTION
} from '../../const';
import { httpGet } from '../../utils';
import state from '../state';

let pollingInterval = 0;
observe(
  state,
  'approvedDelegationResponse',
  action(() => {
    clearInterval(pollingInterval);
    if (!state.approvedDelegationResponse) {
      return;
    }
    if (state.approvedDelegationResponse.status === 'mined') {
      state.globalInfoMessage = INFO_TRANSACTION_MINED(
        state.approvedDelegationResponse.transactionHash,
        state.selectedNetworkNameReadOnly
      );
      if (
        state.successRedirectUrl &&
        typeof state.successRedirectUrl === 'string'
      ) {
        window.location.replace(state.successRedirectUrl);
      }
      return;
    } else if (state.approvedDelegationResponse.status === 'failed') {
      state.globalWarningMessage = WARNING_TRANSACTION_FAILED(
        state.approvedDelegationResponse.id,
        state.approvedDelegationResponse.reason
      );
      return;
    } else {
      state.globalInfoMessage = INFO_WAIT_FOR_TRANSACTION(
        state.approvedDelegationResponse.transactionHash,
        state.selectedNetworkNameReadOnly
      );
    }
    pollingInterval = setInterval(updateFromBackEnd, 10000);
    // Do not update immediately but after one interval
  })
);

async function updateFromBackEnd() {
  const { id, status, meta } = state.approvedDelegationResponse;
  let actualStatus;
  try {
    actualStatus = await httpGet(`${meta.url}/status/${id}`);
  } catch (e) {
    // eslint-disable-next-line require-atomic-updates
    state.globalWarningMessage = WARNING_BACK_END_INVALID_RESPONSE(
      meta.url,
      e.toString()
    );
    return;
  }
  if (!actualStatus || !actualStatus.result) {
    // eslint-disable-next-line require-atomic-updates
    state.globalWarningMessage = WARNING_BACK_END_INVALID_RESPONSE(
      meta.url,
      `weird response ${actualStatus}`
    );
    return;
  }

  // Process status
  const result = actualStatus.result;
  if (result.status === status) {
    return;
  }

  result.meta = meta;
  // eslint-disable-next-line require-atomic-updates
  action(() => {
    state.approvedDelegationResponse = result;
  })();
}
