import React from 'react';
import './styles.css';

const title = "Preium Basketball Teaching";
const description = "Learn how to teach basketball to your students.";
const imageUrl = "/images/basketball_teaching.jpg";
const OrganizationContent: React.FC = () => {
    return (
        <div className='mt'>
            <h1>{title}</h1>
            <p>{description}</p>
            <img src={imageUrl} alt="Basketball" />
            <ul>
                <li><a href="#">How to Teach Basic Basketball Skills</a></li>
                <li><a href="#">How to Create a Fun and Engaging Practice Plan</a></li>
                <li><a href="#">How to Use Technology to Enhance Your Coaching</a></li>
                <li><a href="#">How dribble the ball</a></li>
            </ul>
        </div>
    );
};

export default OrganizationContent;
