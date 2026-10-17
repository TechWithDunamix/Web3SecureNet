interface BrowserWalletProvider {
  request: (request: { method: string }) => Promise<unknown>;
}

export async function connectBrowserWallet() {
  const provider = (window as Window & { ethereum?: BrowserWalletProvider }).ethereum;
  if (!provider) {
    throw new Error('Open this page in a wallet browser or install an Ethereum-compatible browser wallet.');
  }

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const address = Array.isArray(accounts) ? accounts[0] : undefined;
  if (typeof address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('The wallet did not provide a valid public Ethereum address.');
  }

  return { wallet_name: 'Browser wallet', wallet_number: address };
}
