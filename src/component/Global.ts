import { useMessage, useDialog } from 'naive-ui';

export default defineComponent({
    name: 'Global',
    setup (_props) {
        const message = useMessage();
        const dialog = useDialog();
        // const { message, dialog } = createDiscreteApi(['message', 'dialog']);
        window.msg = message;
        window.dialog = dialog;
    },
    render () {
        return  this.$slots.default?.();
    },
});