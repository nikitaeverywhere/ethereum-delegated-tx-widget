import { providers } from 'ethers';

export async function getProvider(
  web3Provider = null,
  reportStatus = () => {}
) {
  if (!web3Provider) {
    web3Provider = await getWeb3Provider(reportStatus);
  }
  return new providers.Web3Provider(web3Provider.currentProvider);
}

export async function getWeb3Provider(reportStatus) {
  // const timeout = setTimeout(
  //   () =>
  //     new Toast(
  //       'Please, sign in with your crypto wallet',
  //       Toast.TYPE_INFO,
  //       Toast.TIME_LONG
  //     ),
  //   5000
  // );

  if (window.ethereum) {
    window.web3 = new window.Web3(window.ethereum);
    try {
      reportStatus('Please, allow an access to this page in your wallet');
      await window.ethereum.enable();
    } catch (error) {
      // clearTimeout(timeout);
      throw new Error("You've denied the access to see your account address.");
    }
  } else if (window.web3) {
    window.web3 = new window.Web3(window.web3.currentProvider);
  } else {
    // clearTimeout(timeout);
    return null;
  }

  // clearTimeout(timeout);

  return window.web3;
}
