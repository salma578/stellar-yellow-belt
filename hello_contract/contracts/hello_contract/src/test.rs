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

#[test]
fn total_badges_increases_after_each_award() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    assert_eq!(client.total_badges(), 0);

    client.award_badge(
        &String::from_str(&env, "Morgan"),
        &String::from_str(&env, "Completed onboarding"),
    );
    assert_eq!(client.total_badges(), 1);

    client.award_badge(
        &String::from_str(&env, "Taylor"),
        &String::from_str(&env, "Completed live transaction"),
    );
    assert_eq!(client.total_badges(), 2);
}

#[test]
fn multiple_badges_can_be_issued_and_the_total_count_is_correct() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let achievements = vec![
        &env,
        String::from_str(&env, "Built a Soroban contract"),
        String::from_str(&env, "Passed the Yellow Belt test suite"),
        String::from_str(&env, "Deployed on Testnet"),
    ];

    let recipients = vec![
        &env,
        String::from_str(&env, "Jordan"),
        String::from_str(&env, "Casey"),
        String::from_str(&env, "Riley"),
    ];

    for i in 0..3 {
        let recipient = recipients.get(i).unwrap();
        let achievement = achievements.get(i).unwrap();
        let badge = client.award_badge(&recipient, &achievement);

        assert_eq!(badge.get(0).unwrap(), String::from_str(&env, "Stellar Yellow Belt"));
        assert_eq!(badge.get(3).unwrap(), String::from_str(&env, "verified"));
    }

    assert_eq!(client.total_badges(), 3);
}
