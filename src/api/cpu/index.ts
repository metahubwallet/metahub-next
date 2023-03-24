import { DTO } from './types';

export default {
    setTime: (dto: DTO) => {
        return http.post('cpu/time', dto);
    },
};
