export interface ResourceBase {
    use_percentage: number;
    use_limit: {
        max: number;
        used: number;
    };
    core_liquid_balance: string;
}

export interface ResourceData extends ResourceBase {
    stake_max: number;
    refund_request: {
        amount: number;
        request_time: number;
        left_time: string;
    };
    total_resources_weight: string;
    self_delegated_bandwidth_weight: string;
    staked_for_user: number;
    staked_for_others: number;
}