import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent } from "forta-agent";
import { TestTransactionEvent, createAddress, generalTestFindingGenerator } from "./tests.utils";
import provideFunctionCallsDetectorHandler from "./agent";
import { AbiItem } from "web3-utils";
import { encodeFunctionSignature, encodeFunctionCall, encodeParameters, decodeParameter } from "./utils";
import BigNumber from "bignumber.js";

describe("Function calls detector Agent Tests", () => {
  let handleTransaction: HandleTransaction;

  it("Returns a finding if createAgent() is called from nm deployer address to the forta polygon contram ", async () => {
    const signature: string = "createAgent()";
    const selector: string = encodeFunctionSignature(signature);
    handleTransaction = provideFunctionCallsDetectorHandler(generalTestFindingGenerator, signature, {
      from: createAddress("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"),
      to: createAddress("0x61447385B019187daa48e91c55c02AF1F1f3F863 "),
    });

    const txEvent1: TransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"),
      to: createAddress("0x61447385B019187daa48e91c55c02AF1F1f3F863 "),
      input: selector,
    });
    let findings: Finding[] = await handleTransaction(txEvent1);
    expect(findings).toStrictEqual([]);

    const txEvent2: TransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"),
      to: createAddress("0x61447385B019187daa48e91c55c02AF1F1f3F863 "),
      input: selector,
    });
    findings = findings.concat(await handleTransaction(txEvent2));
    expect(findings).toStrictEqual([]);

    const txEvent3: TransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"),
      to: createAddress("0x61447385B019187daa48e91c55c02AF1F1f3F863 "),
      input: selector,
    });
    findings = findings.concat(await handleTransaction(txEvent3));
    expect(findings).toStrictEqual([]);

    const txEvent4: TransactionEvent = new TestTransactionEvent().addTraces({
      from: createAddress("0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"),
      to: createAddress("0x61447385B019187daa48e91c55c02AF1F1f3F863 "),
      input: selector,
    });
    findings = findings.concat(await handleTransaction(txEvent4));
    expect(findings).toStrictEqual([generalTestFindingGenerator(txEvent4)]);
  });

});
