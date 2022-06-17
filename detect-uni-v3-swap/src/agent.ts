import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent, getJsonRpcUrl } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, POOL_ABI, POOL_INIT_CODE_HASH } from './constants'

import {
  ethers
} from "ethers"

import {
  Interface,
  keccak256,
  getCreate2Address,
  defaultAbiCoder
} from "ethers/lib/utils";

// type Agent = {
//   handleTransaction: HandleTransaction,
// }

// function provideHandleTransaction(
//   createAgent: Agent,
// ): HandleTransaction {
//   return async function handleTransaction(txEvent: TransactionEvent) {
//     const findings = (await Promise.all([
//       createAgent.handleTransaction(txEvent)
//     ])).flat()

//     return findings
//   }
// }


let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());

export function get_pair_address(token0addr: string, token1addr: string) {
  const pair_address = getCreate2Address(UNI_FACTORY_ADDRESS, keccak256(defaultAbiCoder.encode(["address","address"],[token0addr,token1addr])), POOL_INIT_CODE_HASH);

  return pair_address
}

// async function getTokens(add: string) {
//   const reference = new ethers.Contract(add, POOL_ABI, provider);
//   let tokenAAddress = "";
//   let tokenBAddress = "";
//   let fee = "";
//   try {
//     tokenAAddress = await reference.token0();
//     tokenBAddress = await reference.token1();
//     fee = await reference.fee();

//     return [tokenAAddress, tokenBAddress, fee];
//   } catch (err) {
//     console.log("error");
//     return [tokenAAddress, tokenBAddress, fee];
//   }
// }

console.log('hello0'); 

async function handleTransaction(txEvent: TransactionEvent) {
  const findings: Finding[] = []
  console.log('hey'); 
  const event = txEvent.filterLog(SWAP_EVENT); 

  event.forEach((swap) => {

    const contractAddress = swap.address; 

    // if (contractAddress != get_pair_address(token0addr, token1aadr)) return findings
    if(false) return findings

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
          //agentId: agentId
        }
      }))
    }
  });
  return findings;
};


export default {
  handleTransaction,
  //provideHandleTransaction
}


