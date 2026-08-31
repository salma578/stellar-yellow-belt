# Stellar Yellow Belt

A Soroban-powered dApp for issuing and tracking a project-specific Yellow Belt achievement badge on Stellar Testnet. Users connect a Freighter wallet, enter a recipient name and achievement text, then submit a real signed Soroban transaction to the deployed contract.

## Features

- Freighter wallet connection and permission prompting
- Real Soroban transaction signing through Freighter
- Project-specific `award_badge` contract method
- On-chain badge metadata for a Yellow Belt completion record
- Stellar Testnet deployment and contract verification

## Technologies used

- React + Vite frontend
- Freighter wallet integration
- Soroban smart contract runtime
- Stellar Testnet RPC
- Stellar CLI for contract build and deployment

## Deployed Stellar contract ID

`CAHD6Y7CRSWAP7QEKOIORPAIBMBPQHL7F4ZGQKOUVS4MD2EZ7JPCMCPK`

## Contract function

The Soroban contract exposes the method:

```rust
pub fn award_badge(env: Env, recipient: String, achievement: String) -> Vec<String>
```

It returns a badge payload shaped like:

```text
["Stellar Yellow Belt", recipient, achievement, "verified"]
```

## How it works

1. Connect your Freighter wallet.
2. Approve access if prompted.
3. Enter the recipient name and the achievement description.
4. The app constructs a Soroban contract call, simulates it, signs it with Freighter, and submits the signed transaction to Stellar Testnet.
5. The contract emits the badge result and stores the badge count in storage.

## Run locally

```bash
npm install
npm run dev
```

## Build and test the contract

```bash
cd hello_contract
cargo test --workspace -- --nocapture
stellar contract build --manifest-path Cargo.toml --package hello_contract --out-dir .artifacts --profile release
```

## Freighter wallet instructions

- Install Freighter from the browser extension store.
- Ensure Freighter is connected to Testnet.
- Click Connect Wallet in the app.
- Approve the access request if Freighter prompts for it.
- Then click Award Badge and confirm the transaction in Freighter.

## Stellar Testnet info

- Network: Testnet
- RPC URL: https://soroban-testnet.stellar.org
- Explorer: https://stellar.expert/explorer/testnet

## Contract source

- Smart contract: `hello_contract/contracts/hello_contract/src/lib.rs`
- Tests: `hello_contract/contracts/hello_contract/src/test.rs`
