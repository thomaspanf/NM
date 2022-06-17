import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent } from 'forta-agent'
import { UNI_FACTORY_ADDRESS, SWAP_EVENT, SWAP_ROUTER_ADDRESS } from './constants'


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




async function handleTransaction(txEvent: TransactionEvent) {
  const findings: Finding[] = []

  const functionCalls = txEvent.filterLog(SWAP_EVENT); 

  if (txEvent.to != SWAP_ROUTER_ADDRESS) return findings

  functionCalls.forEach((call) => {

    const { agentId, metadata } = call.args;


    console.log(typeof agentId); 
    console.log(typeof metadata)

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
          metadata: metadata,
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


