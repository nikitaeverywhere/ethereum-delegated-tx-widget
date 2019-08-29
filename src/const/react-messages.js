import React from 'react';
import { formatEthereumAddress } from '../utils/ethereum';

export const WARNING_NO_WEB3 = (
  <span>
    In order to use this delegated transactions service, you need to browse this
    page with{' '}
    <a target="_blank" rel="noopener noreferrer" href="https://metamask.io">
      Metamask wallet
    </a>{' '}
    extension or from your{' '}
    <a target="_blank" rel="noopener noreferrer" href="https://trustwallet.com">
      mobile wallet&apos;s
    </a>{' '}
    embedded DApp browser (if supported).
  </span>
);

export const WARNING_WRONG_NETWORK = (targetNetwork, currentNetwork) => (
  <span>
    Please, switch your wallet to{' '}
    <strong>
      {targetNetwork === 'homestead' ? 'mainnet' : targetNetwork} network
    </strong>{' '}
    (it is currently on {currentNetwork} network).
  </span>
);

export const WARNING_UNKNOWN_NETWORK = network => (
  <span>
    Unknown network selected in your wallet ({network}). Please, switch to main
    network or known testnets (ropsten/kovan)
  </span>
);

export const WARNING_CUSTOM_MESSAGE = message => <span>{message}</span>;

export const WARNING_UNABLE_TO_CONNECT_WEB3 = message => (
  <span>Unable to connect to your wallet. {message}</span>
);

export const WARNING_WRONG_URL_PARAMETER = (name, value) => (
  <span>
    Configuration error: unknown or wrong URL parameter &quot;{name}
    &quot;=&quot;{value}&quot;.
  </span>
);

export const WARNING_CONTRACT_NOT_SUPPORTED = contractAddress => (
  <span>
    There is no back end for contract {formatEthereumAddress(contractAddress)}{' '}
    found which supports delegated transactions. If this contract indeed
    supports delegated transactions, you may add it by contributing to{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/ZitRos/ethereum-delegated-tx-widget"
    >
      this project
    </a>
    .
  </span>
);

export const WARNING_SUPPORTED_CONTRACT_WRONG_NETWORK = (
  currentNetwork,
  targetNetworks = []
) => (
  <span>
    Configured back ends support only{' '}
    <strong>
      {targetNetworks
        .map(targetNetwork =>
          targetNetwork === 'homestead' ? 'mainnet' : targetNetwork
        )
        .join(' or ')}
    </strong>{' '}
    network{targetNetworks.length > 1 ? 's' : ''} for this contract. Please,{' '}
    switch your wallet to {targetNetworks.length > 1 ? 'these' : 'this'} network
    {targetNetworks.length > 1 ? 's' : ''} (it is currently on {currentNetwork}{' '}
    network).
  </span>
);

export const WARNING_BACK_END_ERROR = (url, res) => (
  <span>
    Delegated back end {url} error: {res}
  </span>
);

export const WARNING_BACK_END_INVALID_RESPONSE = (url, res) => (
  <span>
    Delegated back end {url} invalid response: {res}
  </span>
);

export const WARNING_CONFIRMATION_BACK_END_ERROR = (url, message) => (
  <span>
    Unable to confirm delegated request. Delegated back end {url} responds with
    this error: {message}
    <br />
    <strong>
      <u>Check your token balance and reload this page once refilled.</u>
    </strong>
  </span>
);

export const WARNING_TRANSACTION_FAILED = requestId => (
  <span>
    Unfortunately, delegated transaction {requestId} has failed. This could
    happen due to request expiration, network conditions or due to failing
    delegated back end. However, you can retry.
  </span>
);

export const INFO_PLEASE_SIGN = nextStandard => (
  <span>
    Please, confirm the signature in your wallet. If nothing happens, try
    re-opening your wallet.
    {nextStandard ? (
      <span>
        {' '}
        You can also try using the{' '}
        <a href="#" onClick={nextStandard}>
          <b>next signature standard</b>
        </a>
        .
      </span>
    ) : null}
  </span>
);

export const INFO_PLEASE_SIGN_AGAIN = signatureStandards => (
  <span>
    For some reason, we were unable to get a signature from you. Please, try
    again. Available signature standards: {signatureStandards.join(', ')}
  </span>
);

export const INFO_PROCESSING = <span>Processing, please wait...</span>;

export const INFO_WAIT_FOR_TRANSACTION = (txHash, network = 'mainnet') => (
  <span>
    Your transaction{' '}
    {txHash ? (
      <span key="span-swan">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://${network}.etherscan.io/tx/${txHash}`}
        >
          {formatEthereumAddress(txHash)}
        </a>{' '}
      </span>
    ) : null}
    is on its way! Please wait until it is mined, it might take some time.
  </span>
);

export const INFO_TRANSACTION_MINED = (txHash, network = 'mainnet') => (
  <span>
    Done! Your transaction is mined:{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://${network}.etherscan.io/tx/${txHash}`}
    >
      {formatEthereumAddress(txHash)}
    </a>
  </span>
);
