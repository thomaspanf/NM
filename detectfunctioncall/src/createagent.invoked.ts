import { Finding, FindingSeverity, FindingType, TransactionEvent } from "forta-agent";
import { CREATEAGENT_ABI, FORTA_ADDRESS, NETHERMIND_ADDRESS } from './constants'

async function handleTransaction(txEvent: TransactionEvent) {
  const findings: Finding[] = []

  const functionCalls = txEvent.filterFunction(CREATEAGENT_ABI, FORTA_ADDRESS)

  if (txEvent.to != FORTA_ADDRESS) return findings

  functionCalls.forEach((call) => {

    const { metadata } = call.args;
    if (txEvent.from == NETHERMIND_ADDRESS) {
      findings.push(Finding.fromObject({
        name: "function createAgent called",
        description: `createAgent was invoked by ${txEvent.from} (Nethermind Deployer Address)`,
        alertId: "ALERT-0",
        protocol: "forta",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          from: txEvent.from,
          metadata: metadata
        }
      }))
    }
  });
  return findings;
};

export default {
  handleTransaction
}