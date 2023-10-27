import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateInputsLogin } from "../../utils/validation";
import './styles.css';

interface FormData {
    username: string;
    password: string;
}

interface InputFieldProps {
    type: 'text' | 'password';  // you can expand this as required
    name: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string; // assuming this is optional because there might be no error
}

const InputField: React.FC<InputFieldProps> = ({ type, name, placeholder, value, onChange, error }) => {
    return (
        <div className={`input-group ${error ? 'has-error' : ''}`}>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={error ? 'invalid' : ''}
            />
            <i className={`input-icon fa fa-${type === 'password' ? 'lock' : 'user'}`}></i>
            {error && <div className="errors">{error}</div>}
        </div>
    );
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const navigate = useNavigate();
    // const { setRole } = userRole();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorsObject = validateInputsLogin(formData);
        setErrors(errorsObject);
        if (Object.keys(errorsObject).length > 0) return;

        try {
            const response = await axios.post('http://localhost:8000/auth/login.php', formData, {
                withCredentials: true  // include this line
            });
            const { status, role, message } = response.data;

            if (status === 'success') {
                if (role === 4) {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } else {
                setFeedback({ message: message, type: 'success' });
            }

        } catch (error) {
            setFeedback({ message: 'An error occurred. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="wrapper">
            <div className="login-bg"></div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <InputField
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        error={errors.username}
                    />

                    <InputField
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />

                    <div className="btn-container">
                        <button className="submit-btn" type="submit">Login</button>
                        <a className="forgot-password" href="/forgot-password">Forgot password?</a>
                    </div>
                </form>

                {feedback.message && (
                    <div className={`feedback ${feedback.type}`}>
                        <i className={`fa ${feedback.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>

    );

}

export default Login;