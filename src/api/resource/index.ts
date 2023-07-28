export default {
    getTime: (account: string) => {
        return http.post('cpu/time', { account });
    },

    pushTx: (data: any) => {
        return http.post('cpu/pushtx', data);
    },
};
