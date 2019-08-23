import { utils } from 'ethers';
import { httpPost } from './http';
import { INFURA_PUBLIC_API_KEY } from '../const';

export function formatEthereumAddress(address) {
  if (!address) {
    return '0x????..????';
  }
  return address.slice(0, 6) + '..' + address.slice(-4);
}

export function isValidEthereumAddress(address) {
  return typeof address === 'string' && /0x[0-9a-f]{40}/i.test(address);
}

export async function ethCall(networkName, contractAddress, functionSignature) {
  const response = await httpPost(
    `https://${networkName}.infura.io/v3/${INFURA_PUBLIC_API_KEY}`,
    {
      id: 42,
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          data:
            utils.id(functionSignature).slice(0, 10) +
            '00000000000000000000000000000000000000000000000000000000',
          to: contractAddress
        },
        'latest'
      ]
    }
  );
  return response.result;
}
