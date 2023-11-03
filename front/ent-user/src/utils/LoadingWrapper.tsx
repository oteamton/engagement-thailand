import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Spinner from '../assets/Spinning';

const LoadingWrapper: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 300);

        return () => clearTimeout(timer);
    }, [location]);

    return loading ? <Spinner /> : <Outlet />;
};

export default LoadingWrapper;