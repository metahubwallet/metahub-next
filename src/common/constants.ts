import { env } from '@/common/util/env';

let defaultApiUrl = 'https://res.metahub.cash';


export const API_URL = env.API_URL || defaultApiUrl;