import {
    FindingType, 
    FindingSeverity,
    Finding,
    TransactionEvent,
    EventType,
} from "forta-agent"; 

import {
    EventFragment
  } from "ethers/lib/utils";

import agent from "./agent"; 

import {TestTransactionEvent, createAddress} from "forta-agent-tools/lib/tests"; 

import { 
    UNI_FACTORY_ADDRESS,
    SWAP_EVENT,
    POOL_ABI, 
    POOL_INIT_CODE_HASH
} from "./constants";

type mockConstantsType = {
    MOCK_TOKEN0: string;
    MOCK_TOKEN1: string;
    MOCK_UNI_FACTORY_ADDRESS: string;
    MOCK_POOL_INIT_CODE_HASH: string;
    MOCK_FROM_ADDR: string; 
    MOCK_INTERACTED_WITH: string; 
    MOCK_RECIPIENT: string;
    MOCK_SENDER: string; 
};

const MOCK_CONSTANTS: mockConstantsType = {
    MOCK_TOKEN0: createAddress("0x0"), 
    MOCK_TOKEN1: createAddress("0x1"),
    MOCK_UNI_FACTORY_ADDRESS: createAddress("0x2"),
    MOCK_POOL_INIT_CODE_HASH: createAddress("0x3"),
    MOCK_FROM_ADDR: createAddress("0x4"),
    MOCK_INTERACTED_WITH: createAddress("0x5"),
    MOCK_RECIPIENT: createAddress("0x6"),
    MOCK_SENDER: createAddress("0x7"),
};

const{
    MOCK_TOKEN0,
    MOCK_TOKEN1,
    MOCK_UNI_FACTORY_ADDRESS,
    MOCK_POOL_INIT_CODE_HASH,
    MOCK_FROM_ADDR,
    MOCK_INTERACTED_WITH,
    MOCK_RECIPIENT,
    MOCK_SENDER,
} = MOCK_CONSTANTS; 


const createFinding = (
    from: string, 
    sender: string,
    recipient: any, 
    token0Addr: any, 
    token1Addr: any) => Finding.fromObject({
    name: "Uni V3 Swap detected",
    description: 'createAgent was invoked by ${from}',
    alertId: "ALERT-0",
    protocol: "Ethereum",
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    metadata: { 
        interacted_with: sender,
        recipient: recipient,
        token0Addr: token0Addr,
        token1Addr: token1Addr
    },
});

describe("Nethermind bot deploy bot test suite", () => {

    describe("handleTransaction", () => {

        it("should return empty finding if no swap is detectred", async () => {
            const tx: TransactionEvent = new TestTransactionEvent();
            const findings = await agent.handleTransaction(tx); 
            expect(findings).toStrictEqual([]); 

        });
        
        it("should return finding when swap on uni v3 is detected", async () => {
            //not sure how to push a mock transaction event properly. This handleTransaction(tx) returns []
            const tx: TransactionEvent = new TestTransactionEvent().addEventLog(SWAP_EVENT); 
            console.log("printing tx: ")
            console.log(tx); 

            const findings = await agent.handleTransaction(tx);
            
            console.log("printing findings: "); 
            console.log(findings); 
            console.log("printing createFinding: "); 
            console.log(createFinding(MOCK_FROM_ADDR,MOCK_SENDER,MOCK_RECIPIENT,MOCK_TOKEN0,MOCK_TOKEN1)); 

            expect(findings).toStrictEqual([
                createFinding(MOCK_FROM_ADDR,MOCK_SENDER,MOCK_RECIPIENT,MOCK_TOKEN0,MOCK_TOKEN1)
            ]);
        }); 

    });

});