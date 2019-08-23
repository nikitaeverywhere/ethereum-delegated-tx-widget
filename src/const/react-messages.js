import React from 'react';

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
