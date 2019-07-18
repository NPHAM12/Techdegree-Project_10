import React from 'react';

 // Display a message letting the user know that the requested page can't be found.
const NotFound = () => {
	return (
		<div className="bounds">
			<h1>Not Found!</h1>
			<p>Sorry! We couldn't find the page you're looking for.</p>
			<p> <i> Click <strong>Courses</strong> to go back the Home Page </i> </p>
		</div>
	);
}

export default NotFound;
