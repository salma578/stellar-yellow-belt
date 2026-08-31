# Stellar Yellow Belt Soroban Contract

This project contains a project-specific Soroban smart contract for issuing a Yellow Belt completion badge on Stellar Testnet. Instead of the default hello-world template, it exposes an `award_badge` method that accepts a recipient and achievement text and returns a verified badge payload.

## Contract method

```rust
pub fn award_badge(env: Env, recipient: String, achievement: String) -> Vec<String>
```

The method returns a vector with the format:

```text
["Stellar Yellow Belt", recipient, achievement, "verified"]
```

It also tracks the total number of badges issued using the instance storage counter `badge_cnt`.

## Deployed contract

```text
CAHD6Y7CRSWAP7QEKOIORPAIBMBPQHL7F4ZGQKOUVS4MD2EZ7JPCMCPK
```

## Files

- `contracts/hello_contract/src/lib.rs` — main Soroban contract
- `contracts/hello_contract/src/test.rs` — contract regression tests
- `Cargo.toml` — workspace setup for Soroban dependencies

## Build and deploy

```bash
cargo test --workspace -- --nocapture
stellar contract build --manifest-path Cargo.toml --package hello_contract --out-dir .artifacts --profile release
stellar contract deploy --source-account deployer --network testnet --wasm .artifacts/hello_contract.wasm --alias yellowbelt
```

## Notes

The app in the project root calls this deployed contract through Freighter on Stellar Testnet. The Old contract ID has been replaced with the new active deployment ID above.
