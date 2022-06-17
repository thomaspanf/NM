import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent, getEthersProvider } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, SWAP_ROUTER_ADDRESS, POOL_INIT_CODE_HASH } from './constants'

import {
  utils
} from 'ethers' 

import {
  Interface,
  keccak256,
  getCreate2Address,
  defaultAbiCoder
} from "ethers/lib/utils";

type Agent = {
  handleTransaction: HandleTransaction,
}

function provideHandleTransaction(
  createAgent: Agent,
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings = (await Promise.all([
      createAgent.handleTransaction(txEvent)
    ])).flat()

    return findings
  }
}


let provider = getEthersProvider();

export function checkIfUniPool() {
  const address = getCreate2Address(UNI_FACTORY_ADDRESS, '0x0000000000000000000000000000000000000000000000000000000000000000', POOL_INIT_CODE_HASH);


  return false
}


async function handleTransaction(txEvent: TransactionEvent) {
  const findings: Finding[] = []

  const functionCalls = txEvent.filterLog(SWAP_EVENT); 

  if (txEvent.to != SWAP_ROUTER_ADDRESS) return findings

  functionCalls.forEach((swap) => {

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
  provideHandleTransaction
}


