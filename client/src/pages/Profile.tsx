import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile: React.FC = () => {
	const [userData, setUserData] = useState<any>({});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('/api/user/1');
				setUserData(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	return (
		<div>
			<h1>Profile</h1>
			<p><strong>Username:</strong> {userData.username}</p>
			<p><strong>Email:</strong> {userData.email}</p>
			{/* Render other user data as needed */}
		</div>
	);
};

export default Profile;
