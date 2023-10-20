import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
            const response = await fetch('http//localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/userpage');
            } else {
                const data = await response.json();
                setGeneralError(data.error);
            }
        } catch (error) {
            setGeneralError('An error occurred. Please try again.');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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