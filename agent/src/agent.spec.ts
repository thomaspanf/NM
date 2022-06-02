import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  TransactionEvent,
} from 'forta-agent';
import {
  provideCreateAgent,
} from './agent';
import {
  encodeFunctionSignature,
} from "forta-agent-tools";
import {
  TestTransactionEvent,
  createAddress 
} from "forta-agent-tools/lib/tests" 

// const FORTA_ADDRESS = createAddress('0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8');
const FORTA_ADDRESS = createAddress('0x1'); 
const ALERT_ID = 'TEST ALERT';
// const NETHERMIND_ADDRESS = createAddress('0x61447385B019187daa48e91c55c02AF1F1f3F863');
const NETHERMIND_ADDRESS = createAddress('0x5');
const createFinding = (from: string, contract_address: string) => Finding.fromObject({
  name: 'createAgent function call Detected',
  description: 'createAgent function called on Nethermind Deployer contract.',
  alertId: ALERT_ID,
  severity: FindingSeverity.Low,
  type: FindingType.Suspicious,
  metadata: {
    from: from,
    contract_address: contract_address,
  },
});

describe('createAgent called from Nethermind Deployer contract', () => {
  let handleTransaction: HandleTransaction = provideCreateAgent(ALERT_ID, FORTA_ADDRESS);
  let selector: string;
  let wrongSelector: string;
  beforeAll(() => {
    selector = encodeFunctionSignature('createAgent()');
    wrongSelector = encodeFunctionSignature('create_Agent()');

  });

  it('should return createAgent function call finding', async () => {

    const txEvent: TransactionEvent = new TestTransactionEvent().addTraces({
      from: NETHERMIND_ADDRESS,
      to: FORTA_ADDRESS,
      input: selector,
    });

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([createFinding(NETHERMIND_ADDRESS, FORTA_ADDRESS)]);

  });

  it('should ignore empty transactions', async () => {
    const tx: TransactionEvent = new TestTransactionEvent();

    const findings = await handleTransaction(tx);
    expect(findings).toStrictEqual([]);
  });

  it("should return empty finding because of wrong signature", async () => {

    const txEvent: TransactionEvent = new TestTransactionEvent().addTraces({
      from: NETHERMIND_ADDRESS,
      to: FORTA_ADDRESS,
      input: wrongSelector,
    });

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("should ignore createAgent calls to other contracts", async () => {

    const txEvent: TransactionEvent = new TestTransactionEvent().addTraces({
      from: NETHERMIND_ADDRESS,
      to: createAddress('0x2'),
      input: selector,
    });

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

});