import { Finding, FindingSeverity, FindingType, TransactionEvent } from "forta-agent";
import { FORTA_ADDRESS, NETHERMIND_ADDRESS } from './constants'

async function handleTransaction(txEvent: TransactionEvent) {
  const findings: Finding[] = []

  // if not calling drip() function on Compound Reservoir contract, return
  
  const FunctionCalls = txEvent.filterFunction("function createAgent(uint256 agentId, address owner, string metadata, uint256[] chainIds)", FORTA_ADDRESS)
  // const { agentId, owner, metadata, chainIds} = deployEvent.args;


  if (txEvent.from == NETHERMIND_ADDRESS)

  // determine how much COMP dripped using Transfer event


  findings.push(Finding.fromObject({
    name: "function createAgent called",
    description: `createAgent was invoked by ${txEvent.from} (Nethermind Deployer Address)`,
    alertId: "ALERT-0",
    protocol: "forta",
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    metadata: {
      from: txEvent.from,
    }
  }))

  return findings
}

export default {
  handleTransaction
}