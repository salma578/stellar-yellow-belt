# Stellar Yellow Belt Soroban Contract

This contract is the project-specific smart contract for the Yellow Belt demo. Instead of the default hello-world template, it exposes an `award_badge` method that creates a verified badge payload for a recipient and project milestone.

## Contract method

```rust
pub fn award_badge(env: Env, recipient: String, achievement: String) -> Vec<String>
```

The function returns a vector shaped like:

```text
["Stellar Yellow Belt", recipient, achievement, "verified"]
```

## Deployed contract

```text
CB47RKMUX54G7UCXN5ROVTX3CMTBP4GNYHJFBHH37FPMJMPK7GL3DYTS
```

## Files

- `contracts/hello_contract/src/lib.rs` — main Soroban contract
- `contracts/hello_contract/src/test.rs` — contract regression tests
- `Cargo.toml` — workspace setup for Soroban dependencies

## Validation

Run the workspace tests with:

```bash
cargo test --workspace
```

The contract is designed to support the frontend wallet flow used by the React app in the project root.
