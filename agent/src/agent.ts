import {
  Finding,
  HandleTransaction,
  FindingSeverity,
  FindingType,
  ethers,
  TransactionEvent,
  createTransactionEvent,
  getTransactionReceipt,
} from 'forta-agent';
import {
  FindingGenerator,
  provideFunctionCallsDetectorHandler,
} from "forta-agent-tools";

export const POLYGON_ADDRESS = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
const abi = ["function createAgent(uint256 agentId, address owner, string metadata, uint256[] chainIds)"];
export const iface = new ethers.utils.Interface(abi);


const createFindingGenerator = (alertId: string, address: string): FindingGenerator =>
  (metadata: { [key: string]: any } | undefined): Finding =>
    Finding.fromObject({
      name: 'createAgent function call Detected',
      description: 'createAgent function called on Nethermind Deployer contract.',
      alertId: alertId,
      severity: FindingSeverity.Low,
      type: FindingType.Suspicious,
      metadata: {
        from: metadata!.from,
        contract_address: address,
      },
    });

export const provideCreateAgent = (
  alertID: string,
  address: string
): HandleTransaction => provideFunctionCallsDetectorHandler(
  createFindingGenerator(alertID, address),
  iface.getFunction('createAgent').format('sighash'),
  {
    to: address,
  }
);

console.log(createFindingGenerator); 

export default {
  handleTransaction: provideCreateAgent(
    "ALERT-0",
    POLYGON_ADDRESS,
  )
};