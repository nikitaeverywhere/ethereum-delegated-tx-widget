export function formatEthereumAddress(address) {
  if (!address) {
    return '0x????..????';
  }
  return address.slice(0, 6) + '..' + address.slice(-4);
}

export function formatTokenValue(value, decimals = 18) {
  value = value.toString();
  if (/e\+[0-9]+$/.test(value)) {
    const pow = +value.match(/[0-9]+$/)[0];
    value = value.replace(/\./, '').replace(/e\+[0-9]+$/, '');
    value = value.padEnd(1 + pow, '0');
  }
  value = value.padStart(decimals + 1, '0');
  return (
    (value.substring(0, value.length - decimals).replace(/^0+/, '') || '0') +
    '.' +
    value.substr(-decimals, 2)
  );
}

export function parseTokenValueFromInput(inputValue, decimals = 18) {
  const parts = inputValue.split('.');
  const num = parts[0] + parts[1].padEnd(2, '0');
  return num.padEnd(num.length + decimals - 2, '0').replace(/^0+/, '') || '0';
}

export function isValidEthereumAddress(address) {
  return typeof address === 'string' && /0x[0-9a-f]{40}/i.test(address);
}

export async function signData(state, standard, data) {
  const provider = state.ethersProvider;
  try {
    if (standard === 'eth_signTypedData') {
      const res = await provider.send('eth_signTypedData', [
        data,
        state.currentEthereumAccount.toString()
      ]);
      return res;
    } else if (standard === 'eth_personalSign') {
      const res = await provider.send('eth_sign', [
        data,
        state.currentEthereumAccount.toString()
      ]);
      return res;
    }
  } catch (e) {
    return '';
  }
}
