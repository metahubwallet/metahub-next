import BigNumber from 'bignumber.js';

export function powerup(
    payer: string,
    receiver: string,
    cpuQuantity: string = '',
    netQuantity: string = '',
    powupState: any | null = null
) {
    if (!powupState) {
        powupState = {
            version: 0,
            net: {
                version: 0,
                weight: '95454029146410',
                weight_ratio: '10000000000000',
                assumed_stake_weight: '964182112590',
                initial_weight_ratio: '1000000000000000',
                target_weight_ratio: '10000000000000',
                initial_timestamp: '2021-02-24T03:31:31',
                target_timestamp: '2021-04-08T08:08:08',
                exponent: '2.00000000000000000',
                decay_secs: 86400,
                min_price: '2500.0000 EOS',
                max_price: '75000.0000 EOS',
                utilization: '61231951534',
                adjusted_utilization: '76422565604',
                utilization_timestamp: '2022-08-24T07:01:36',
            },
            cpu: {
                version: 0,
                weight: '381816116585640',
                weight_ratio: '10000000000000',
                assumed_stake_weight: '3856728450360',
                initial_weight_ratio: '1000000000000000',
                target_weight_ratio: '10000000000000',
                initial_timestamp: '2021-02-24T03:31:31',
                target_timestamp: '2021-04-08T08:08:08',
                exponent: '2.00000000000000000',
                decay_secs: 86400,
                min_price: '2500.0000 EOS',
                max_price: '75000.0000 EOS',
                utilization: '17169999664732',
                adjusted_utilization: '21599474228273',
                utilization_timestamp: '2022-08-24T07:01:36',
            },
            powerup_days: 1,
            min_powerup_fee: '0.0001 EOS',
        };
    }
    const cpuAmount = parseAmount(cpuQuantity);
    const netAmount = parseAmount(netQuantity);
    let cpuFrac = 0,
        cpuFee = 0,
        netFrac = 0,
        netFee = 0;
    if (cpuAmount) ({ cpuFrac, cpuFee } = calcCpuParams(cpuAmount, powupState));
    if (netAmount) ({ netFrac, netFee } = calcNetParams(netAmount, powupState));

    const parms = {
        payer,
        receiver,
        days: parseInt(powupState.powerup_days),
        net_frac: netFrac,
        cpu_frac: cpuFrac,
        max_payment:
            toBN(cpuFee + netFee)
                .div(10000)
                .toFixed(4) + ' EOS',
    };
    return parms;
}

function calcCpuParams(cpuAmount: number, powupState: any) {
    const rentbwFrac = Math.pow(10, 15);
    const cpuWeight = parseInt(powupState.cpu.weight);
    const cpuFrac = parseInt(toBN(cpuAmount).times(rentbwFrac).div(cpuWeight).toFixed(0));
    const utilizationIncrease = parseInt(toBN(cpuFrac).times(cpuWeight).div(rentbwFrac).toFixed(0));
    const cpuFee = calcPowerupFee(powupState.cpu, utilizationIncrease);
    return { cpuFrac: cpuFrac, cpuFee };
}

function calcNetParams(netAmount: number, powupState: any) {
    const rentbwFrac = Math.pow(10, 15);
    const netWeight = parseInt(powupState.net.weight);
    const netFrac = parseInt(toBN(netAmount).times(rentbwFrac).div(netWeight).toFixed(0));
    const utilizationIncrease = parseInt(toBN(netFrac).times(netWeight).div(rentbwFrac).toFixed(0));
    const netFee = calcPowerupFee(powupState.net, utilizationIncrease);
    return { netFrac: netFrac, netFee };
}

function calcPowerupFee(state: any, utilization_increase: number): number {
    if (utilization_increase <= 0) {
        return 0;
    }
    let min_price = parseAmount(state.min_price);
    let max_price = parseAmount(state.max_price);
    const exponent = parseInt(state.exponent);
    const weight = parseInt(state.weight);

    const priceIntegralDelta = (start_utilization: number, end_utilization: number): number => {
        const exponent = parseInt(state.exponent);
        const weight = parseInt(state.weight);
        let coefficient = (start_utilization - end_utilization) / exponent;
        let start_u = start_utilization / weight;
        let end_u = end_utilization / weight;
        const result =
            min_price * end_u -
            min_price * start_u +
            coefficient * Math.pow(end_u, exponent) -
            coefficient * Math.pow(start_u, exponent);
        return result;
    };

    const priceFunction = (utilization: number): number => {
        let price = min_price;
        let new_exponent = exponent - 1.0;
        if (new_exponent <= 0) {
            return max_price;
        } else {
            price += (max_price - min_price) * Math.pow(utilization / weight, new_exponent);
        }
        return price;
    };

    let fee = 0.0;
    let start_utilization = parseInt(state.utilization);
    let end_utilization = start_utilization + utilization_increase;

    let adjusted_utilization = parseInt(state.adjusted_utilization);
    if (start_utilization < adjusted_utilization) {
        fee +=
            (priceFunction(adjusted_utilization) *
                Math.min(utilization_increase, adjusted_utilization - start_utilization)) /
            weight;
        start_utilization = adjusted_utilization;
    }
    if (start_utilization < end_utilization) {
        fee += priceIntegralDelta(start_utilization, end_utilization);
    }
    return Math.ceil(fee);
}

function parseAmount(num: string): number {
    return parseFloat(num.split(' ')[0].replace('.', ''));
}

function toBN(num: number | string): BigNumber {
    return new BigNumber(num);
}
