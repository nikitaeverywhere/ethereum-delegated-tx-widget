import { observe, action, runInAction, toJS } from 'mobx';
import {
  WARNING_BACK_END_ERROR,
  WARNING_CONFIRMATION_BACK_END_ERROR,
  INFO_PLEASE_SIGN,
  INFO_PLEASE_SIGN_AGAIN,
  INFO_PROCESSING
} from '../../const';
import { httpPost, signData } from '../../utils';
import state from '../state';

observe(
  state,
  'delegationConfirmationRequestPending',
  action(async () => {
    // React only to pending request start
    if (
      state.delegationConfirmationRequestPending !== true ||
      !state.approvedDelegationRequest
    ) {
      return;
    }

    // Sign with available signature standards
    console.log(state.approvedDelegationRequest);
    const signatureOptionsPriority = ['eth_signTypedData', 'eth_personalSign'];
    const signOptionsByPriority = toJS(
      state.approvedDelegationRequest.signatureOptions
    ).sort(
      (o1, o2) =>
        (signatureOptionsPriority.indexOf(o2.standard) + 1 || 999) -
        (signatureOptionsPriority.indexOf(o1.standard) + 1 || 999)
    );

    let signOption;
    let signature = '';
    let signatureStandard = '';
    while ((signOption = signOptionsByPriority.pop())) {
      const { standard, dataToSign } = signOption;
      try {
        signature = await new Promise((res, rej) => {
          runInAction(
            () =>
              (state.globalInfoMessage = INFO_PLEASE_SIGN(
                signOptionsByPriority.length
                  ? () => rej(new Error('Skipped by user'))
                  : null
              ))
          );
          try {
            signData(state, standard, dataToSign)
              .then(res)
              .catch(rej);
          } catch (e) {
            rej(e);
          }
        });
      } catch (e) {
        // Do nothing - it should switch to the next available signature standard
      }
      signatureStandard = standard;
      if (signature) {
        break;
      }
    }
    if (!signature) {
      runInAction(() => {
        state.globalInfoMessage = INFO_PLEASE_SIGN_AGAIN(
          toJS(state.approvedDelegationRequest.signatureOptions).map(
            o => o.standard
          )
        );
        state.delegationConfirmationRequestPending = false;
      });
      return;
    } else {
      runInAction(() => (state.globalInfoMessage = INFO_PROCESSING));
    }

    // Confirm request with signature
    let response;
    try {
      response = await httpPost(
        `${state.approvedDelegationRequest.meta.url}/confirm`,
        {
          requestId: state.approvedDelegationRequest.id,
          signatureStandard,
          signature
        }
      );
    } catch (e) {
      runInAction(() => {
        state.globalInfoMessage = '';
        state.globalWarningMessage = WARNING_CONFIRMATION_BACK_END_ERROR(
          state.approvedDelegationRequest.meta.url,
          e
        );
        state.delegationConfirmationRequestPending = false;
      });
      console.error(e);
      return;
    }

    // Process response
    console.log('Success!', response);
    runInAction(() => {
      if (!response || !response.result) {
        state.globalWarningMessage = WARNING_BACK_END_ERROR(
          state.approvedDelegationRequest.meta.url,
          `Weird back end response: ${JSON.stringify(response)}`
        );
        return;
      }
      const result = response.result;
      result.meta = state.approvedDelegationRequest.meta;
      state.approvedDelegationResponse = result;
    });
  })
);
