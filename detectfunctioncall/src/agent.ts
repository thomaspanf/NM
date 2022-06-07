import { HandleTransaction, TransactionEvent } from 'forta-agent'
import dripInvokedAgent from './drip.invoked'

type Agent = {
  handleTransaction: HandleTransaction,
}

function provideHandleTransaction(
  dripInvokedAgent: Agent,
): HandleTransaction {

  return async function handleTransaction(txEvent: TransactionEvent) {
    const findings = (await Promise.all([
      dripInvokedAgent.handleTransaction(txEvent)
    ])).flat()

    return findings
  }
}

export default {
  handleTransaction: provideHandleTransaction(dripInvokedAgent),
}