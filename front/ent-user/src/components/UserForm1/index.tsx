import React, { useState } from 'react';
import axios from 'axios';
import { validateInputs } from '../../utils/validation';
import './styles.css';


interface FormData {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
    tosAccepted: boolean;
}

const UserRegistrationForm1: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', name: '', surname: '', email: '', password: '', confirmPassword: '', tosAccepted: false });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [feedback, setFeedback] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSubmitted(true);

        const errorsObject = validateInputs(formData);
        setErrors(errorsObject);
        if (Object.keys(errorsObject).length > 0) return;

        try {
            const response = await axios.post('/register/user', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setFeedback('Check your email for activation');
        } catch (errors: any) {
            const errorMessage = errors.response?.data?.message || 'Registration errors. Please try again.';
            setFeedback(errorMessage);
        }
    };

    const handleResendEmail = async () => {
        // Implement logic to resend activation email. This is just a placeholder.
        console.log('Resending email...');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <div className="errors">{errors.username}</div>}
                </div>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    {errors.name && <div className="errors">{errors.name}</div>}
                </div>
                <div>
                    <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                    />
                    {errors.surname && <div className="errors">{errors.surname}</div>}
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <div className="errors">{errors.email}</div>}
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <div className="errors">{errors.password}</div>}
                </div>
                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {errors.confirmPassword && <div className="errors">{errors.confirmPassword}</div>}
                </div>
                {/* Add other fields if needed */}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="tosAccepted"
                            checked={formData.tosAccepted}
                            onChange={handleInputChange}
                        />
                        I accept the <a href="/path-to-tos" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
                    </label>
                    {errors.tosAccepted && <div className="errors">{errors.tosAccepted}</div>}
                </div>
                <button type="submit">Register</button>
            </form>

            {feedback && <div className="errors">{feedback}</div>}

            {hasSubmitted && feedback && !feedback.includes('activation') && (
                <button onClick={handleResendEmail}>Resend email</button>
            )}
        </div>
    );
};

export default UserRegistrationForm1;
