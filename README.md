# Stellar Yellow Belt

A mini Stellar Soroban project that demonstrates a Freighter wallet connection and a project-specific smart contract. The app lets a wallet owner submit a name and achievement message, then calls a deployed Soroban contract that returns a verified Yellow Belt badge payload.

## Project overview

- Frontend: React + Vite app for wallet connection and contract interaction
- Wallet: Freighter wallet integration for Testnet access
- Smart contract: Soroban contract with a custom `award_badge` method
- Network: Stellar Testnet
- Deployed contract ID: `CB47RKMUX54G7UCXN5ROVTX3CMTBP4GNYHJFBHH37FPMJMPK7GL3DYTS`

## How it works

1. Connect your Freighter wallet.
2. Allow the extension to sign transactions.
3. Enter a recipient name and achievement message.
4. The app simulates and signs a Soroban transaction, then submits it to the network.
5. The contract returns a badge payload in the form:
   `Stellar Yellow Belt | recipient | achievement | verified`

## Contract location

The Soroban contract lives in the workspace under:

- `hello_contract/contracts/hello_contract/src/lib.rs`

## Run locally

```bash
npm install
npm run dev
```

## Build the Soroban contract

```bash
cd hello_contract
cargo test --workspace
cargo build --workspace --target wasm32v1-none
```

## Notes

This project was built for the Stellar Testnet environment and uses the Freighter wallet extension to sign transactions for the contract call.
