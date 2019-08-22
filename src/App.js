import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import './App.css';
import state, { unknownNetwork } from './state';
import TransferArrow from './components/TransferArrow';
import TokenLogo from './components/TokenLogo';
import WarningIcon from './components/WarningIcon';
import { formatEthereumAddress } from './utils';
import { NETWORK_BY_CHAIN_ID } from './const';
import { getWeb3Provider, getProvider } from './modules/ethereum';

class App extends React.PureComponent {
  state = {
    warningMessage: (
      <span>
        In order to use this delegated transactions service, you need to browse
        this page with{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://metamask.io">
          Metamask wallet
        </a>{' '}
        extension or from your{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://trustwallet.com"
        >
          mobile wallet&apos;s
        </a>{' '}
        embedded DApp browser (if supported).
      </span>
    )
  };

  accountUpdateTimeout = 1;
  provider = null;
  web3Provider = null;

  updateFromProvider = action(async () => {
    if (!this.provider) {
      return;
    }
    const account = (await this.provider.listAccounts())[0];
    let network;
    // this.provider.getNetwork() always returns the same net, looks like a bug in Ethers.js. Using the native method
    do {
      network = await new Promise((res, rej) =>
        this.web3Provider.version.getNetwork((e, r) => (e ? rej(e) : res(r)))
      );
      if (!NETWORK_BY_CHAIN_ID[network]) {
        this.setState({
          warningMessage: (
            <span>
              Unknown network selected in your wallet. Please, switch to main
              network or known testnets (ropsten/kovan)
            </span>
          )
        });
        await new Promise(r => setTimeout(r, 5000));
      }
    } while (!NETWORK_BY_CHAIN_ID[network]);

    if (state.currentAccount !== account) {
      state.currentAccount = account;
    }
    if (+network !== state.currentNetwork.chainId) {
      state.currentNetwork = NETWORK_BY_CHAIN_ID[network] || unknownNetwork;
    }

    if (this.accountUpdateTimeout > 0) {
      this.accountUpdateTimeout = setTimeout(this.updateFromProvider, 100); // Loop
    }
  });

  async componentDidMount() {
    try {
      this.web3Provider = await getWeb3Provider(message =>
        this.setState({
          warningMessage: <span>{message}</span>
        })
      );
      if (!this.web3Provider) {
        // Show default warning message
        return;
      }
      this.provider = await getProvider(this.web3Provider);
      await this.updateFromProvider();
      this.setState({
        warningMessage: null
      });
      console.log('Provider', this.provider);
    } catch (e) {
      this.setState({
        warningMessage: (
          <span>Unable to connect to your wallet. {e.toString()}</span>
        )
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.accountUpdateTimeout);
    this.accountUpdateTimeout = 0;
  }

  render() {
    const sender = formatEthereumAddress(state.currentAccount);
    const recipient = formatEthereumAddress(
      '0x6f8103606b649522aF9687e8f1e7399eff8c4a6B'
    );
    const value = 5;
    const fee = 2.1516;
    return (
      <div className="app">
        <section className="app-body">
          <h1 className="head-title">Transfer</h1>
          {/* <div className="head-subtitle">Delegated token transaction</div> */}
          <div className="token-info">
            {value} <TokenLogo /> DREAM
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
                {fee} <TokenLogo /> DREAM
              </div>
            </div>
            <div className="spec-table-row">
              <div>Confirmation Time</div>
              <div>~3 minutes</div>
            </div>
          </div>
          {this.state.warningMessage && (
            <div className="warning-message">
              <WarningIcon /> {this.state.warningMessage}
            </div>
          )}
          <div className="center">
            <button className={this.state.warningMessage ? 'unavailable' : ''}>
              Confirm
            </button>
          </div>
        </section>
      </div>
    );
  }
}

export default observer(App);

// function App() {

//   const [currentAccount, setCurrentAccount] = useState("");
//   const [warningMessage, setWarningMessage] = useState();
//   const [currentNetwork, setCurrentNetwork] = useState(unknownNetwork);

//   const updateFromProvider = useCallback(async () => {
//     if (!provider) {
//       return;
//     }
//     const account = (await provider.listAccounts())[0];
//     if (currentAccount != account) {
//       setCurrentAccount(account);
//     }
//     let network;
//     // this.provider.getNetwork() always returns the same net, looks like a bug in Ethers.js. Using the native method
//     do {
//       network = await new Promise((res, rej) => web3Provider.version.getNetwork((e, r) => e ? rej(e) : res(r)));
//       if (!ethNetworksByChainId[network]) {
//         setWarningMessage(<span>
//           Unknown network selected in your wallet. Please, switch to main network or known testnets (ropsten/kovan)
//         </span>);
//         await new Promise(r => setTimeout(r, 3000));
//       }
//     } while (!ethNetworksByChainId[network]);
//     if (+network != currentNetwork.chainId) {
//       setCurrentNetwork(ethNetworksByChainId[network] || unknownNetwork);
//     }
//   }, [currentAccount, currentNetwork]);

//     accountUpdateTimeout = 0;
// }

// export default App;
