import React from 'react';
import './styles.css';

const title = "Basketball Teaching";
const description = "Learn how to teach basketball to your students.";
const imageUrl = "/images/basketball_teaching.jpg";
const GuestContent: React.FC = () => {
    return (
        <div className='mt'>
            <h1>Guest Content</h1>
            <h1>{title}</h1>
            <p>{description}</p>
            <img src={imageUrl} alt="Basketball" />
            <ul>
                <li><a href="#">How to Teach Basic Basketball Skills</a></li>
                <li><a href="#">How to Create a Fun and Engaging Practice Plan</a></li>
                <li><a href="#">How to Use Technology to Enhance Your Coaching</a></li>
            </ul>
        </div>
    );
};

export default GuestContent;
