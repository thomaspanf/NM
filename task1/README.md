# Detect if Nethermind Forta Deployer account deploys a new bot 

## Description

This agent detects transactions when createAgent() is called from 0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8 (Nethermind Deployer Address) to 0xA8A26969f7Be888D020B595340c490c02ec445dD (Forta Agent Registry Contract)

## Alerts

Describe each of the type of alerts fired by this agent

- FORTA-1
  - Fired when a transaction contains a Tether transfer over 10,000 USDT
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - Mention any other type of metadata fields included with this alert

## Test Data

 