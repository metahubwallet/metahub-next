import { env } from '@/common/util/env';

let defaultApiUrl = 'https://res.metahub.fun';


export const API_URL = env.API_URL || defaultApiUrl;