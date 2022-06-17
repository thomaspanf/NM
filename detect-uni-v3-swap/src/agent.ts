import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent, getJsonRpcUrl } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, SWAP_ROUTER_ADDRESS, POOL_INIT_CODE_HASH } from './constants'

import {
  ethers
} from "ethers"

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


let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());

export function checkIfUniPool(token0: string, token1: string) {
  const pair_address = getCreate2Address(UNI_FACTORY_ADDRESS, keccak256(defaultAbiCoder.encode(["address","address"],[token0,token1])), POOL_INIT_CODE_HASH);


  return false
}

export function getTokenAddresses() {


  return
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


