import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerificationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>('Verifying...');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search);
        const token = urlSearchParams.get("token");

        if (token) {
            setToken(token);
            verifyAndInsert(token);
        } else {
            setStatus('Verification failed');
        }
    }, [location]);

    // Verify and insert
    const verifyAndInsert = useCallback(async (token: string) => {
        try {
            const response = await axios.post('http://localhost:8000/endpoint/register/user.php',
                { token: token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

            if (response.status === 200) {
                setStatus('Verified');
                navigate('/login');
                console.log(token);
                return <p>Thank for Registration!</p>;
            } else {
                setStatus('Verification failed');
            }
        } catch (error) {
            setStatus('Verification failed');
        }
    }, []);

    return (
        <div>
            <div className="container">
                <h1>{status}</h1>
                {status.includes('Verified')}
            </div>
        </div>
    );
}

export default VerificationPage;