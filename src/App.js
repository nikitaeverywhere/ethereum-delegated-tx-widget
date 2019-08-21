import React from 'react';
import './App.css';
import TransferArrow from './components/TransferArrow';
import TokenLogo from './components/TokenLogo';
import WarningIcon from './components/WarningIcon';
import { formatEthereumAddress } from './utils';

function App() {
  const sender = formatEthereumAddress(
    '0x6f8103606b649522aF9687e8f1e7399eff8c4a6B'
  );
  const recipient = formatEthereumAddress(
    '0x6f8103606b649522aF9687e8f1e7399eff8c4a6B'
  );
  const value = 5;
  const fee = 2.1516;
  const warningMessage = (
    <span>
      Insufficient funds. Sender&apos;s account {sender} have {0} DREAM tokens,
      but {value + fee} DREAM (value + fee) is required for this transaction.
    </span>
  );
  // const warningMessage = null;
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
        {warningMessage && (
          <div className="warning-message">
            <WarningIcon /> {warningMessage}
          </div>
        )}
        <div className="center">
          <button className={warningMessage ? 'unavailable' : ''}>
            Confirm
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
