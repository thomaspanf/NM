# Detect Function Call Agent 

## Description

This agent monitors the pushes a finding when createAgent() is called from the Nethermind Deployer Account to the Forta Agent Contract

## Supported Chains

- Ethereum
- Polygon

## Alerts

- ALERT-0

  - Fired when createAgent is invoked from Nethermind Deployer Account to Forta Agent Contract
  - Severity is always set to "Low"
  - Type is always set to "Info"
  - Metadata fields included:
    - `from` - the address invoked the call
    - `metadata` - tx metadata

## Test Data

The agent behaviour can be verified with the following transactions:

- 0xb7947c246d5b72295dbb6ab26f87f8959aaaaa430daa852886610d7727a94d97 (fires ALERT-0 alert)

