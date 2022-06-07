import {
    FindingType,
    FindingSeverity,
    Finding,
    TransactionEvent,
} from "forta-agent";

import agent from "./agent";
import { CREATEAGENT_ABI, FORTA_ADDRESS, NETHERMIND_ADDRESS } from './constants'

import { TestTransactionEvent } from "forta-agent-tools/lib/tests";
import { createAddress } from "forta-agent-tools/lib/tests";

//const testTx = "0xb7947c246d5b72295dbb6ab26f87f8959aaaaa430daa852886610d7727a94d97";
const txData = "0x7935d5b436e1b2b2d47cc73f4d7ea199648403d795b022ff2268e151a6054446adde7ecf00000000000000000000000088dc3a2284fa62e0027d6d6b1fcfdd2141a143b8000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000002e516d5273684856644c553369645654524572337956664e7075594b4476653545523157503741644d665a6957337500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000038";
const metadata = "QmRshHVdLU3idVTREr3yVfNpuYKDve5ER1WP7AdMfZiW3u";

const createFinding = (from: string, contract_address: string) => Finding.fromObject({
    name: "function createAgent called",
    description: `createAgent was invoked by ${from} (Nethermind Deployer Address)`,
    alertId: "ALERT-0",
    protocol: "forta",
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    metadata: {
        from: from,
        metadata: metadata
    },
});

describe("Nethermind bot deploy bot test suite", () => {

    describe("handleTransaction", () => {

        it('should return finding if createAgent is invoked from the Nethermind Deployer Account to the Forta Polygon Address', async () => {

            const tx: TransactionEvent = new TestTransactionEvent().setFrom(NETHERMIND_ADDRESS).setTo(FORTA_ADDRESS).setData(txData);
            const findings = await agent.handleTransaction(tx);
            expect(findings).toStrictEqual([createFinding(NETHERMIND_ADDRESS, FORTA_ADDRESS)])

        })

        it('should ignore transactions not sent by NETHERMIND_ADDRESS', async () => {
            const tx: TransactionEvent = new TestTransactionEvent().setFrom(createAddress("0x0")).setTo(FORTA_ADDRESS)
            const findings = await agent.handleTransaction(tx);
            expect(findings).toStrictEqual([]);

        })

        it('should ignore transactions sent by NETHERMIND_ADDRESS to incorrect address', async () => {
            const tx: TransactionEvent = new TestTransactionEvent().setFrom(NETHERMIND_ADDRESS).setTo(createAddress("0x1"));
            const findings = await agent.handleTransaction(tx);
            expect(findings).toStrictEqual([]);
        })

        it('should ignore transactions sent by incorrect address to FORTA_ADDRESS', async () => {
            const tx: TransactionEvent = new TestTransactionEvent().setFrom(createAddress("0x2")).setTo(FORTA_ADDRESS);
            const findings = await agent.handleTransaction(tx);
            expect(findings).toStrictEqual([]);
        })


        it('should ignore empty transactions', async () => {
            const tx: TransactionEvent = new TestTransactionEvent();

            const findings = await agent.handleTransaction(tx);
            expect(findings).toStrictEqual([]);
        });

    });

});