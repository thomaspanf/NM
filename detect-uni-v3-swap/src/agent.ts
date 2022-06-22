import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent, getJsonRpcUrl } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, POOL_ABI, POOL_INIT_CODE_HASH } from './constants'

import {
  ethers
} from "ethers"

import {
  keccak256,
  getCreate2Address,
  defaultAbiCoder,
  solidityPack
} from "ethers/lib/utils";

let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());

export function get_pair_address(token0addr: string, token1addr: string) {
  //const pair_address = getCreate2Address(UNI_FACTORY_ADDRESS, keccak256(defaultAbiCoder.encode(["string","string"],[token0addr,token1addr])), POOL_INIT_CODE_HASH);

  const salt = solidityPack(["string", "string"], [token0addr, token1addr]); 


  const pair_address = getCreate2Address(
    UNI_FACTORY_ADDRESS,
    salt,
    POOL_INIT_CODE_HASH
  )
  return pair_address.toLowerCase();
}

async function handleTransaction(txEvent: TransactionEvent) {
  
  const findings: Finding[] = []
  const event = txEvent.filterLog(SWAP_EVENT); 

  
  await Promise.all( //waits for each promise to resolve 
    event.map(async swap => { //event.map returns array in which each array element is a promise 
  // event.forEach(async (swap) => { //incorrect await will return a promise and forEach will end the loop there. 
    const poolAddr = swap.address.toLowerCase(); 

    let contractInstance = new ethers.Contract(poolAddr, POOL_ABI, provider);
    console.log("contract address = " + poolAddr); 

    let token0Addr = "";
    let token1Addr = ""; 
    try {
      token0Addr = await contractInstance.token0();
      token1Addr = await contractInstance.token1(); 
    } catch (e) {
      console.log("error");
    } 
    console.log("token0: " + token0Addr); 
    console.log("token1: " + token1Addr); 

    console.log("create2address = " + get_pair_address(token0Addr, token1Addr));

    //if (poolAddr !== get_pair_address(token0addr, token1addr)) return findings

    const { sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick } = swap.args;

    if (true) {
      findings.push(Finding.fromObject({
        name: "Uni V3 Swap detected",
        description: `Uni V3 Swap invoked by ${txEvent.from}`,
        alertId: "ALERT-0",
        protocol: "forta",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          amount0: amount0,
          amount1: amount1,
        }
      }))
    }
  }));
  return findings;
};

export default {
  handleTransaction,
}


// async function getTokens(poolAddr: string) {
//   const reference = new ethers.Contract(poolAddr, POOL_ABI, provider);
//   let tokenAAddress = "";
//   let tokenBAddress = "";
//   try {
//     tokenAAddress = await reference.token0();
//     tokenBAddress = await reference.token1();
//     return [tokenAAddress, tokenBAddress]; 
//   } catch (err) {
//     console.log("error");
//     return [tokenAAddress, tokenBAddress];
//   }
// }