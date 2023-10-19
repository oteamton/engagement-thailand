interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export const validateInputs = (formData: FormData): FormErrors => {
    const errors: FormErrors = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (formData.username === '') errors.username = 'Username is required.';
    if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email address.';
    }
    if (formData.password.length < 8) errors.password = 'Password should be at least 8 characters.';
    if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match.';

    return errors;
};

interface LoginFormData {
    username: string;
    password: string;
}

interface LoginFormErrors {
    username?: string;
    password?: string;
}

export const validateInputsLogin = (loginData: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};

    if (loginData.username === '' || loginData.password === '') errors.username = 'Username and Password are required.';
    return errors;
}