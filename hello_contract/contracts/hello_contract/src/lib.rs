#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn award_badge(env: Env, recipient: String, achievement: String) -> Vec<String> {
        vec![
            &env,
            String::from_str(&env, "Stellar Yellow Belt"),
            recipient,
            achievement,
            String::from_str(&env, "verified"),
        ]
    }
}

mod test;
