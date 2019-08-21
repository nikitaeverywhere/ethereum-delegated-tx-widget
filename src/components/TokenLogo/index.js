import React from 'react';
import PropTypes from 'prop-types';
import './TokenLogo.css';

export default function TokenLogo(props) {
  const tokenAddress =
    props.tokenAddress || '0x82f4ded9cec9b5750fbff5c2185aee35afc16587';
  const assetUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenAddress}/logo.png`;
  return <img className="token-logo-img" src={assetUrl} alt="" />;
}

TokenLogo.propTypes = {
  tokenAddress: PropTypes.string
};
