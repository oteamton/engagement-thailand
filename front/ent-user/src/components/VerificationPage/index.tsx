import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const VerificationPage: React.FC = () => {
    const location = useLocation();
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
    const verifyAndInsert = async (token: string) => {
        try {
            const response = await axios.post('http://localhost:8000/endpoint/register/user.php', {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setStatus('Verified');
                console.log(token);
            } else {
                setStatus('Verification failed');
            }
        } catch (error) {
            setStatus('Verification failed');
        }
    };

    return (
        <div>
            <div className="container">
                <h1>{status}</h1>
                {status.includes('Verified') && <p>Thank for Registration!</p>}
            </div>
        </div>
    );
}

export default VerificationPage;