
import BigNumber from 'bignumber.js';

export function powerup(payer:string, receiver:string, cpuQuantity:string='', netQuantity:string='', powup_state: any | null = null) {
  // const powup_state = await eos_rpc.get_table_rows({
  //   code: 'eosio',
  //   scope: '',
  //   table: 'powup.state',
  //   json: true,
  //   limit: 1
  // });
  if (!powup_state) {
    powup_state = {
      "version": 0,
      "net": {
          "version": 0,
          "weight": "95454029146410",
          "weight_ratio": "10000000000000",
          "assumed_stake_weight": "964182112590",
          "initial_weight_ratio": "1000000000000000",
          "target_weight_ratio": "10000000000000",
          "initial_timestamp": "2021-02-24T03:31:31",
          "target_timestamp": "2021-04-08T08:08:08",
          "exponent": "2.00000000000000000",
          "decay_secs": 86400,
          "min_price": "2500.0000 EOS",
          "max_price": "75000.0000 EOS",
          "utilization": "61231951534",
          "adjusted_utilization": "76422565604",
          "utilization_timestamp": "2022-08-24T07:01:36"
      },
      "cpu": {
          "version": 0,
          "weight": "381816116585640",
          "weight_ratio": "10000000000000",
          "assumed_stake_weight": "3856728450360",
          "initial_weight_ratio": "1000000000000000",
          "target_weight_ratio": "10000000000000",
          "initial_timestamp": "2021-02-24T03:31:31",
          "target_timestamp": "2021-04-08T08:08:08",
          "exponent": "2.00000000000000000",
          "decay_secs": 86400,
          "min_price": "2500.0000 EOS",
          "max_price": "75000.0000 EOS",
          "utilization": "17169999664732",
          "adjusted_utilization": "21599474228273",
          "utilization_timestamp": "2022-08-24T07:01:36"
      },
      "powerup_days": 1,
      "min_powerup_fee": "0.0001 EOS"
    };
  }
  const cpuAmount = parseAmount(cpuQuantity);
  const netAmount = parseAmount(netQuantity);
  let cpuFrac=0, cpuFee=0, netFrac=0, netFee=0;
  if (cpuAmount) {
    ({ cpuFrac, cpuFee } = calc_cpu_params(cpuAmount, powup_state));
  }
  if (netAmount) {
    ({ netFrac, netFee } = calc_net_params(netAmount, powup_state));
  }

  const parms = {
    payer,
    receiver,
    days: parseInt(powup_state.powerup_days),
    netFrac: netFrac,
    cpuFrac: cpuFrac,
    max_payment: toBN(cpuFee + netFee).div(10000).toFixed(4) + ' EOS'
  };
//   console.log(parms);
  return parms;
}

function calc_cpu_params(cpuAmount: number, powup_state: any) {
  // const cpuAmount = 10000;  // 表示租用1EOS
  const rentbw_frac = Math.pow(10, 15);
  const cpu_weight = parseInt(powup_state.cpu.weight);
  const cpuFrac = Math.floor(toBN(cpuAmount).times(rentbw_frac).div(cpu_weight).toNumber());
  const utilizationIncrease = parseInt(toBN(cpuFrac).times(cpu_weight).div(rentbw_frac).toFixed(0));
  // console.log('utilization_increase', utilization_increase);
  const cpuFee = calc_powerup_fee(powup_state.cpu, utilizationIncrease);
  // console.log('cpuFee', cpuFee);
  return { cpuFrac, cpuFee }
}

function calc_net_params(netAmount: number, powup_state: any) {
  const rentbw_frac = Math.pow(10, 15);
  const net_weight = parseInt(powup_state.net.weight);
  const netFrac = Math.floor(toBN(netAmount).times(rentbw_frac).div(net_weight).toNumber());
  const utilizationIncrease = parseInt(toBN(netFrac).times(net_weight).div(rentbw_frac).toFixed(0));
  // console.log('utilization_increase', utilization_increase);
  const netFee = calc_powerup_fee(powup_state.net, utilizationIncrease);
  // console.log('netFee', netFee);
  // console.log('netFrac', netFrac);
  return { netFrac, netFee }
}

function calc_powerup_fee(state: any, utilization_increase: number):number {
  if (utilization_increase <= 0) {
    return 0;
  }
  let min_price = parseAmount(state.min_price);
  let max_price = parseAmount(state.max_price);
  const exponent = parseInt(state.exponent);
  const weight = parseInt(state.weight);

  // console.log(min_price.toString(), max_price.toString(), exponent.toString());
  const price_integral_delta = (start_utilization: number, end_utilization: number): number => {
    const exponent = parseInt(state.exponent);
    const weight = parseInt(state.weight);
    let coefficient = (start_utilization - end_utilization) / exponent;
    console.log('coefficient', coefficient);
    let start_u = start_utilization / weight;
    let end_u = end_utilization / weight;
    const result = min_price * end_u - min_price * start_u +
               coefficient * Math.pow(end_u, exponent) - coefficient *  Math.pow(start_u, exponent);
    return result;
  };

  const price_function = (utilization:number):number => {
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
    fee += price_function(adjusted_utilization) * Math.min(utilization_increase, adjusted_utilization - start_utilization) / weight;
    start_utilization = adjusted_utilization;
  }
  if (start_utilization < end_utilization) {
    fee += price_integral_delta(start_utilization, end_utilization);
  }
  return Math.ceil(fee);
}

function parseAmount(num: string) : number {
  return parseFloat(num.split(' ')[0].replace('.', ''));
}

function toBN(num: number|string): BigNumber {
  return new BigNumber(num);
}

