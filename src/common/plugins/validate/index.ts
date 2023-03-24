import * as veeValidate from 'vee-validate';
import yup from './yup';

// 重新封装useField
const useFields = (schema: { [key: string]: any }) => {
    const fields = Object.keys(schema);
    fields.forEach((field) => veeValidate.useField(field));
};

// 重新封装useForm
const useForm = veeValidate.useForm;
const useForms = (schema: { [key: string]: any }, initValues?: any[]) => {
    let values: Record<string, any> = {};

    Object.keys(schema).forEach((key, index) => {
        if (initValues && initValues[index]) values[key] = initValues[index];
        else values[key] = '';
    });

    const data = useForm({
        validationSchema: yup.object(schema),
        initialValues: values,
    });
    useFields(schema);

    return data;
};

export { yup, useForms };
