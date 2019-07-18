/* UserSignOut
  This component is a bit of an oddball as it doesn't render any visual elements.
  Instead, it signs out the authenticated user and redirects the user
    to the default route "/" (i.e. the list of courses).
*/

// The signOut() method should remove the authenticated user and password from the global state.
import React from "react"
import {Redirect} from 'react-router-dom'

const UserSignOut = () => {
  localStorage.clear();
    return (
        <Redirect to="/" > </Redirect>
    )
}

export default UserSignOut
