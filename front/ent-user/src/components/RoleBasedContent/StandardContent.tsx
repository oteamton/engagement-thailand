import React from 'react';
import { Link } from "react-router-dom";
import './styles.css';

const StandardContent: React.FC = () => {
    return (
        <div className="b-title">
            <h1>Standard Content</h1>
            <Link to="/">Go back home</Link>
        </div>
    );
};

export default StandardContent;
