export function formatEthereumAddress(address) {
  if (!address) {
    return '0x????..????';
  }
  return address.slice(0, 6) + '..' + address.slice(-4);
}
