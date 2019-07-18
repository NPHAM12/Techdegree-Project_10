import React from 'react';

// Displays a message letting the user know that they can't access the requested page.
const Forbidden = () => {
	return (
		<div className="bounds">
			<h1>Forbidden</h1>
			<p>Oh oh, you cannot access to this page</p>
			<p> <i> Click <strong>Courses</strong> to go back the Home Page </i> </p>
		</div>
	);
}

export default Forbidden;
