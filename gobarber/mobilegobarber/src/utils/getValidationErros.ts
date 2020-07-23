import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default function getValidationErros(err: ValidationError): Errors {

    const validatedErrors: Errors = {};

    err.inner.forEach((error) => {
        validatedErrors[error.path] = error.message;
    });

    return validatedErrors;
};
