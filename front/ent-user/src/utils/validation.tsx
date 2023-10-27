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
    else if (formData.username.length < 6) errors.username = 'Username should be at least 6 characters.';

    if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email address.';
    }

    if (formData.password.length < 8) errors.password = 'Password should be at least 8 characters.';
    else if (!(/[a-z]/.test(formData.password))) errors.password = 'Password should contain at least one lowercase character.';
    else if (!(/[A-Z]/.test(formData.password))) errors.password = 'Password should contain at least one uppercase character.';

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

    if (!loginData.username) {
        errors.username = 'Username is required.';
    }

    if (!loginData.password) {
        errors.password = 'Password is required.';
    }

    return errors;
};