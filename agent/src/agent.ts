import {
  Finding,
  HandleTransaction,
  FindingSeverity,
  FindingType,
  ethers,
} from 'forta-agent';
import { 
  FindingGenerator, 
  provideFunctionCallsDetectorHandler,
} from "forta-agent-tools";

export const NETHERMIND_DEPLOYER_CONTRACT_ADDRESS = "0x61447385B019187daa48e91c55c02AF1F1f3F863"; 
const abi = ["function createAgent()"];
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
  
export default {
  handleTransaction: provideCreateAgent(
    "ALERT-0", 
    NETHERMIND_DEPLOYER_CONTRACT_ADDRESS,
  )
};