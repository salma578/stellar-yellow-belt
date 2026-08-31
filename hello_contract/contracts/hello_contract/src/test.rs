#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, String};

#[test]
fn award_badge_issues_a_project_specific_yellow_belt_status() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let badge = client.award_badge(
        &String::from_str(&env, "Alex"),
        &String::from_str(&env, "Finished the Stellar Yellow Belt project"),
    );

    assert_eq!(
        badge,
        vec![
            &env,
            String::from_str(&env, "Stellar Yellow Belt"),
            String::from_str(&env, "Alex"),
            String::from_str(&env, "Finished the Stellar Yellow Belt project"),
            String::from_str(&env, "verified"),
        ]
    );

    let total = client.total_badges();
    assert_eq!(total, 1);
}
