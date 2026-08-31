#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, String, Vec};

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn award_badge(env: Env, recipient: String, achievement: String) -> Vec<String> {
        let badge_count: u32 = env
            .storage()
            .instance()
            .get(&symbol_short!("badge_cnt"))
            .unwrap_or(0);

        let next_badge_id = badge_count + 1;
        env.storage()
            .instance()
            .set(&symbol_short!("badge_cnt"), &next_badge_id);

        vec![
            &env,
            String::from_str(&env, "Stellar Yellow Belt"),
            recipient,
            achievement,
            String::from_str(&env, "verified"),
        ]
    }

    pub fn total_badges(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&symbol_short!("badge_cnt"))
            .unwrap_or(0)
    }
}

mod test;
