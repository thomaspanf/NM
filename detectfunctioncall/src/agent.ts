import { HandleTransaction, TransactionEvent } from 'forta-agent'
import createAgent from './createagent.invoked'

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

export default {
  handleTransaction: provideHandleTransaction(createAgent),
}