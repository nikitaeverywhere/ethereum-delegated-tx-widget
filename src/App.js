import React from 'react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import './App.css';
import { state } from './state';
import TransferArrow from './components/TransferArrow';
import TokenLogo from './components/TokenLogo';
import WarningIcon from './components/WarningIcon';
import InfoIcon from './components/InfoIcon';
import Button from './components/Button';
import {
  formatEthereumAddress,
  formatTokenValue,
  getBackEndContracts
} from './utils';
import {
  NETWORK_BY_CHAIN_ID,
  UNKNOWN_NETWORK,
  WARNING_UNKNOWN_NETWORK,
  WARNING_WRONG_NETWORK,
  WARNING_CUSTOM_MESSAGE,
  WARNING_UNABLE_TO_CONNECT_WEB3
} from './const';
import { getWeb3Provider, wrapEthersProvider } from './modules/ethereum';

const getContractNetworks = () =>
  getBackEndContracts(state).map(b => NETWORK_BY_CHAIN_ID[b.networkChainId]);
const isCurrentNetworkTarget = () =>
  state.selectedNetwork.chainId === state.targetNetwork.chainId;
const isButtonActive = () =>
  !state.warningMessageReadOnly &&
  state.approvedDelegationRequest &&
  !state.delegationConfirmationRequestPending;

class App extends React.PureComponent {
  state = {
    tick: 0
  };

  accountUpdateTimeout = 1;
  web3Provider = null;
  tickerInterval = 0;

  ticker = () => {
    if (!state.approvedDelegationRequest) {
      return;
    }
    this.setState({
      tick: this.state.tick + 1
    });
  };

  updateFromProvider = action(async () => {
    if (!state.ethersProvider) {
      // Displays default initWarningMessage
      return;
    }
    const account = (await state.ethersProvider.listAccounts())[0];
    let network;
    // this.provider.getNetwork() always returns the same net, looks like a bug in Ethers.js. Using the native method
    do {
      // eslint-disable-next-line require-atomic-updates
      network = await new Promise((res, rej) =>
        this.web3Provider.version.getNetwork((e, r) => (e ? rej(e) : res(r)))
      );
      if (!NETWORK_BY_CHAIN_ID[network]) {
        runInAction(
          () => (state.networkWarningMessage = WARNING_UNKNOWN_NETWORK(network))
        );
        await new Promise(r => setTimeout(r, 5000));
      }
    } while (!NETWORK_BY_CHAIN_ID[network]);

    runInAction(() => {
      // Update account
      if (state.currentEthereumAccount !== account) {
        state.currentEthereumAccount = account;
      }

      // Update selected network
      if (+network !== state.selectedNetwork.chainId) {
        state.selectedNetwork = NETWORK_BY_CHAIN_ID[network] || UNKNOWN_NETWORK;
      }

      // Make Target Network a network which has the selected contract.
      const contractsInOtherNetworks = getContractNetworks().filter(
        net => net.chainId !== state.targetNetwork.chainId
      );
      if (
        contractsInOtherNetworks.length &&
        state.targetNetwork.chainId !== contractsInOtherNetworks[0].chainId
      ) {
        state.targetNetwork = contractsInOtherNetworks[0];
      }

      // Target network warning
      if (!isCurrentNetworkTarget()) {
        if (!state.networkWarningMessage) {
          state.networkWarningMessage = WARNING_WRONG_NETWORK(
            state.targetNetwork.name,
            state.selectedNetwork.name
          );
        }
      } else {
        state.networkWarningMessage = null;
      }
    });

    if (this.accountUpdateTimeout > 0) {
      this.accountUpdateTimeout = setTimeout(this.updateFromProvider, 100); // Loop
    }
  });

  componentDidMount = action(async () => {
    this.tickerInterval = setInterval(this.ticker, 1000);
    try {
      this.web3Provider = await getWeb3Provider(message =>
        runInAction(
          () => (state.initWarningMessage = WARNING_CUSTOM_MESSAGE(message))
        )
      );
      if (!this.web3Provider) {
        // Show default initWarningMessage
        return;
      }
      let provider = await wrapEthersProvider(this.web3Provider);
      runInAction(() => {
        state.initWarningMessage = null;
        state.ethersProvider = provider;
      });
      await this.updateFromProvider();
      console.log('Provider', provider);
    } catch (e) {
      runInAction(
        () =>
          (state.initWarningMessage = WARNING_UNABLE_TO_CONNECT_WEB3(
            e.toString()
          ))
      );
      console.error(e);
    }
  });

  componentWillUnmount() {
    clearTimeout(this.accountUpdateTimeout);
    clearInterval(this.tickerInterval);
    this.accountUpdateTimeout = 0;
  }

  actionButtonClick = action(async () => {
    if (!isButtonActive()) {
      return;
    }
    // There is a reaction on changing this prop which enables signing / back end request
    runInAction(() => (state.delegationConfirmationRequestPending = true));
  });

  onRecipientChange = action(
    ({ target: { value } }) =>
      (state.functionArguments = [value, ...state.functionArguments.slice(1)])
  );

  render() {
    const sender = formatEthereumAddress(state.currentEthereumAccount);
    const {
      contractAddress,
      contractSymbolReadOnly,
      functionArguments,
      contractDecimalsReadOnly,
      approvedDelegationRequest
    } = state;
    const recipient =
      (functionArguments && functionArguments.length && functionArguments[0]) ||
      '0x6f8103606b649522aF9687e8f1e7399eff8c4a6B';
    const value = formatTokenValue(
      (functionArguments && functionArguments.length && functionArguments[1]) ||
        Math.pow(10, contractDecimalsReadOnly).toString(),
      contractDecimalsReadOnly
    );
    const fee = formatTokenValue(
      (approvedDelegationRequest && approvedDelegationRequest.fee) || 0,
      contractDecimalsReadOnly
    );
    let warning = state.warningMessageReadOnly;
    const isLoading =
      !warning &&
      (!state.approvedDelegationRequest ||
        state.delegationConfirmationRequestPending);
    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const nowUtc = Date.now() - tzOffset;
    const expiresIn = !state.approvedDelegationRequest
      ? ''
      : new Date(
          Math.max(
            tzOffset,
            new Date(state.approvedDelegationRequest.expiresAt).getTime() -
              nowUtc
          )
        )
          .toTimeString()
          .replace(/\s.*$/, '')
          .replace(/^00:/, '');

    return (
      <div className="app">
        <section />
        <section className="app-body">
          <h1 className="head-title">Transfer</h1>
          <div className="token-info">
            {value} <TokenLogo tokenAddress={contractAddress} />{' '}
            {contractSymbolReadOnly}
          </div>
          <div className="sender-and-recipient-block">
            <div>
              <div>
                <input value={sender} disabled />
              </div>
              <div className="address-sub">Sender (You)</div>
            </div>
            <TransferArrow />
            <div>
              <div>
                <input
                  value={recipient}
                  onChange={this.onRecipientChange}
                  disabled={state.fixed}
                />
                <div className="address-sub">Recipient</div>
              </div>
            </div>
          </div>
          <div className="spec-table">
            <div className="spec-table-row">
              <div>Fee for Sender</div>
              <div className="strong">
                {fee} <TokenLogo tokenAddress={contractAddress} />{' '}
                {contractSymbolReadOnly}
              </div>
            </div>
            {!state.approvedDelegationRequest ? null : (
              <div className="spec-table-row">
                <div>Fee Expires In</div>
                <div>{expiresIn}</div>
              </div>
            )}
            <div className="spec-table-row">
              <div>Confirmation Time</div>
              <div>~3 minutes</div>
            </div>
          </div>
          {(warning || state.globalInfoMessage) && (
            <div
              className={
                'warning-message' +
                (!warning && state.globalInfoMessage ? ' info' : '')
              }
            >
              {warning ? <WarningIcon /> : <InfoIcon />}{' '}
              {warning || state.globalInfoMessage}
            </div>
          )}
          {state.approvedDelegationResponse &&
          state.approvedDelegationResponse.status === 'mined' ? null : (
            <div className="center">
              <Button
                className={(!isButtonActive() && 'unavailable') || ''}
                loading={isLoading}
                onClick={this.actionButtonClick}
              >
                {state.approvedDelegationResponse &&
                (state.approvedDelegationResponse.status === 'new' ||
                  state.approvedDelegationResponse.status === 'mining' ||
                  state.approvedDelegationResponse.status === 'confirmed')
                  ? 'Waiting'
                  : 'Confirm'}
              </Button>
            </div>
          )}
        </section>
        <section className="app-footer">
          Universal Delegated Transactions Back End
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ZitRos/ethereum-delegated-tx-widget"
          >
            Source Code
          </a>{' '}
          |{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ZitRos/ethereum-delegated-tx-widget/LICENSE"
          >
            License
          </a>
        </section>
      </div>
    );
  }
}

export default observer(App);
