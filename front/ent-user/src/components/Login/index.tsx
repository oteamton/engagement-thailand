import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateInputsLogin } from "../../utils/validation";

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorsObject = validateInputsLogin(formData);
        setErrors(errorsObject);
        if (Object.keys(errorsObject).length > 0) return;

        try {
            const response = await axios.post('http://localhost:8000/auth/login.php', formData);

            const data = response.data;

            if (data.status === 'success') {
                // Store the session ID in local storage
                localStorage.setItem('session_id', data.session_id);

                // Optional: store other data like user role
                localStorage.setItem('role', data.role);

                navigate('/user');
            } else {
                setGeneralError(data.message || 'Login failed.');
            }
        } catch (error) {
            setGeneralError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                {errors.username && <div>{errors.username}</div>}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                {errors.password && <div>{errors.password}</div>}

                <button type="submit">Login</button>
            </form>

            {generalError && <div>{generalError}</div>}

            <button onClick={() => navigate('/forgot-password')}>Forgot password?</button>
        </div>

    );
}

export default Login;