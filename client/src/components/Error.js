import React from 'react';

//  Display a message letting the user know that an unexpected error has occurred.
const Error = () => {
	return (
		<div className="bounds">
			<h1>Error!</h1>
			<p>Sorry! We just encountered an unexpected error.</p>
			<p> <i> Click <strong>Courses</strong> to go back the Home Page </i> </p>
		</div>
	);
}
export default Error;
