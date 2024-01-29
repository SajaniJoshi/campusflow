import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        // Fetch user details from the backend
        const fetchUserDetails = async () => {
            try {
                // Get the authentication token from storage
                const authToken = localStorage.getItem('authToken');

                // Include the token in the headers of the request
                const response = await axios.get('https://oauth2.googleapis.com/tokeninfo?id_token=' + authToken, {
                });

                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            <p>First Name: {userDetails.given_name}</p>
            <p>Last Name: {userDetails.family_name}</p>
            <p>Email: {userDetails.email}</p>
            {/* Add other fields as needed */}
        </div>
    );
};

export default UserProfile;
