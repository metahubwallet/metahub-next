export default {
    getTime: (account: string) => {
        return http.post('cpu/time', { account });
    },
};
