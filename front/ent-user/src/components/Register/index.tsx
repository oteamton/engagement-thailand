import React, { useState } from 'react';
import axios from 'axios';
import { validateInputs } from '../../utils/validation';
import './styles.css';
import EntLogo from '../../assets/Ent_logo280.png'

interface FormData {
    username: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
    tosAccepted: boolean;
}

const UserRegister: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ username: '', name: '', surname: '', email: '', password: '', confirmPassword: '', tosAccepted: false });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorsObject = validateInputs(formData);
        setErrors(errorsObject);
        if (Object.keys(errorsObject).length > 0) return;

        try {
            const response = await axios.post('http://localhost:8000/auth/user_verify_register.php', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setFeedback({ message: 'Registration successful. Check your email for activation', type: 'success' });
            setHasSubmitted(true);
        } catch (errors: any) {
            const errorMessage = errors.response?.data?.message || 'Registration errors. Please try again.';
            setFeedback({ message: errorMessage, type: 'error' });
        }
    };

    const handleResendEmail = async () => {
        // Implement logic to resend activation email. This is just a placeholder.
        console.log('Resending email...');
    };

    return (
        <div className="wrapper">
            <img className="ent_logo" src={EntLogo} alt="ent logo" />
            <div className="form-container">
                <div className="dark-bg"></div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group" style={errors.username ? { marginBottom: '25px' } : {}} >
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={errors.username ? 'invalid' : ''}
                        />
                        <i className="input-icon fa fa-user"></i>
                        {errors.username && <div className="errors">{errors.username}</div>}
                    </div>

                    <div className="input-group" style={errors.email ? { marginBottom: '25px' } : {}} >
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'invalid' : ''}
                        />
                        <i className="input-icon fa fa-envelope"></i>
                        {errors.email && <div className="errors">{errors.email}</div>}
                    </div>

                    <div className="input-group" style={errors.password ? { marginBottom: '25px' } : {}} >
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={errors.password ? 'invalid' : ''}
                        />
                        <i className="input-icon fa fa-lock"></i>
                        {errors.password && <div className="errors">{errors.password}</div>}
                    </div>

                    <div className="input-group" style={errors.password ? { marginBottom: '25px' } : {}} >
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={errors.confirmPassword ? 'invalid' : ''}
                        />
                        <i className="input-icon fa fa-lock"></i>
                        {errors.confirmPassword && <div className="errors">{errors.confirmPassword}</div>}
                    </div>

                    <div className="checkbox-container">
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

                    <div className='btn-container'>
                        <button type="submit">Register</button>
                        <p className='reg-title'>Already have an account? <a href="/login">Login</a></p>
                        {hasSubmitted && feedback && (
                            <button className='btn-resend' onClick={handleResendEmail}>Resend email</button>
                        )}
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
};

export default UserRegister;
