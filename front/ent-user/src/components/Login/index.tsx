import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateInputsLogin } from "../../utils/validation";
import './styles.css';

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
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
                setGeneralError(message);
            }

        } catch (error) {
            setGeneralError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="wrapper">
            <div className="login-bg"></div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="input-field"
                        type="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <div className="error-message">{errors.username}</div>}

                    <input
                        className="input-field"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <div className="error-message">{errors.password}</div>}

                    <div className="btn-container">
                        <button className="submit-btn" type="submit">Login</button>
                        <button className="forgot-password-btn" onClick={() => navigate('/forgot-password')}>Forgot password?</button>
                    </div>
                </form>

                {generalError && <div className="general-error">{generalError}</div>}
            </div>
        </div>
    );

}

export default Login;