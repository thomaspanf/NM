import { Finding, FindingSeverity, FindingType, TransactionEvent, getJsonRpcUrl } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, POOL_ABI, POOL_INIT_CODE_HASH } from './constants'

import {
  ethers,
  BigNumberish,
} from "ethers"

import {
  keccak256,
  getCreate2Address,
  defaultAbiCoder,
} from "ethers/lib/utils";

let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());

export function get_pair_address(token0addr: string, token1addr: string, fee: BigNumberish) {
  const pair_address = getCreate2Address(
    UNI_FACTORY_ADDRESS,
    keccak256(defaultAbiCoder.encode(["address","address","uint24"],[token0addr,token1addr,fee])),
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
    let token0Addr = "";
    let token1Addr = ""; 
    let fee = ""; 
    try {
      token0Addr = await contractInstance.token0();
      token1Addr = await contractInstance.token1(); 
      fee = await contractInstance.fee(); 
    } catch (e) {
      console.log("error");
    } 

    if (poolAddr !==get_pair_address(token0Addr, token1Addr,fee)) return findings
    const { sender, recipient } = swap.args;

    if(true){
      findings.push(Finding.fromObject({
        name: "Uni V3 Swap detected",
        description: `Uni V3 Swap invoked by ${txEvent.from}`,
        alertId: "ALERT-0",
        protocol: "Ethereum",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          interacted_with: sender, 
          recipient: recipient,
          token0Addr: token0Addr,
          token1Addr: token1Addr
        }
      }))
    }
  }));
  return findings;
};

export default {
  handleTransaction,
}
