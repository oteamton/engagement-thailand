import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css"; // Importing styles

const VerificationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<string>("Verifying...");
    const [countdown, setCountdown] = useState<number>(5);

    const getStatusClass = (status: string) => {
        switch (status) {
          case 'Verified':
            return 'status-active';
          case 'Verification failed':
            return 'status-expired';
        }
      };

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search);
        const token = urlSearchParams.get("token");

        if (!token) {
            setStatus("Verification failed");
            return;
        }

        verifyAndInsert(token);
    }, [location]);

    const verifyAndInsert = useCallback(async (token: string) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/endpoint/register/user.php",
                { token },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setStatus("Verified");

                // Start countdown
                const intervalId = setInterval(() => {
                    setCountdown(prevCount => {
                        if (prevCount === 1) {
                            clearInterval(intervalId);
                            navigate("/login");
                            return 0;
                        }
                        return prevCount - 1;
                    });
                }, 1000);

            } else {
                setStatus("Verification failed");
            }
        } catch (error) {
            console.error("Verification failed: ", error);
            setStatus("Verification failed");
        }
    }, []);

    return (
        <div className="container">
            
            <h1 className={getStatusClass(status)}>{status}</h1>
            {status.includes("Verified") && <p className="thank-you">Thank you for Registration!</p> && <p>Redirecting in {countdown} seconds</p>}
            <div className="dark-bg"></div>

        </div>
    );
};

export default VerificationPage;
