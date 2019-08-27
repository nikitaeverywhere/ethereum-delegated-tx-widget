import React from 'react';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import './App.css';
import { state } from './state';
import TransferArrow from './components/TransferArrow';
import TokenLogo from './components/TokenLogo';
import WarningIcon from './components/WarningIcon';
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

class App extends React.PureComponent {
  accountUpdateTimeout = 1;
  web3Provider = null;

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
    this.accountUpdateTimeout = 0;
  }

  actionButtonClick = async () => {
    if (!state.approvedDelegationRequest) {
      return;
    }
    // todo
  };

  render() {
    const sender = formatEthereumAddress(state.currentEthereumAccount);
    const {
      contractAddress,
      contractSymbolReadOnly,
      functionArguments,
      contractDecimalsReadOnly,
      approvedDelegationRequest
    } = state;
    const recipient = formatEthereumAddress(
      (functionArguments && functionArguments.length && functionArguments[0]) ||
        '0x6f8103606b649522aF9687e8f1e7399eff8c4a6B'
    );
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

    return (
      <div className="app">
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
                <input value={recipient} disabled />
              </div>
              <div className="address-sub">Recipient</div>
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
            <div className="spec-table-row">
              <div>Confirmation Time</div>
              <div>~3 minutes</div>
            </div>
          </div>
          {warning && (
            <div className="warning-message">
              <WarningIcon /> {warning}
            </div>
          )}
          <div className="center">
            <Button
              className={
                warning || !state.approvedDelegationRequest ? 'unavailable' : ''
              }
              loading={!warning && !state.approvedDelegationRequest}
              onClick={this.actionButtonClick}
            >
              Confirm
            </Button>
          </div>
        </section>
      </div>
    );
  }
}

export default observer(App);
