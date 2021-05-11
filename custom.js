document.onload = async () =>{
  wallet = await new ethers.Wallet.createRandom();
  console.log(`Loaded wallet ${wallet.address}`);
  privateKey = wallet.privateKey;
  publicKey = wallet.signingKey.publicKey;
  web3 = web3 = new Web3(window.ethereum);
};
