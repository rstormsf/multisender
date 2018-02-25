import Web3 from 'web3';
import ERC20ABI from './ERC20ABI'
export {
  getTokenDecimals
}
const getTokenDecimals = async ({web3Instance, tokenAddress}) => {
  const web3 = new Web3(web3Instance.currentProvider); 
  const token = new web3.eth.Contract(ERC20ABI, tokenAddress);
  return await token.methods.decimals().call();
}
