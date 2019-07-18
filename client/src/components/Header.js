/* Header
  Displays the top menu bar for the application and includes
  buttons for signing in and signing up if there's not an authenticated user
  or the user's first and last name and a button for signing out (if there's an authenticated user).
*/

import React from "react"
import {Link} from 'react-router-dom'
import {ClientConsumer} from "./ClientContext"

const Header = () =>   {
 return (
    //consumer passes signout method from app and uses it as click funtion to remove current user
    <ClientConsumer>
      {({signOut}) => (
        localStorage.getItem("name")
        ?
         //if signed in -> renders user name and signout button
         ( <div>
         <div className="header">
             <div className="bounds">
                 <h1 className="header--logo">
                  <Link to="/"> Courses </Link>
                </h1>
                 <nav>
                  <span className="signOut">Welcome {localStorage.getItem("name")}!</span>
                  < Link to="/signout" className="signin" onClick={signOut}>Sign Out</Link>
                  </nav>
             </div>
         </div>
         </div>
        )
        :
        //if didn't sign in -> renders sign in and sign up button
        ( <div>
              <div className="header">
                  <div className="bounds">
                      <h1 className="header--logo">
                        <Link to="/"> Courses </Link></h1>
                      <nav>< Link to="/signup" className="signup">Sign Up</Link></nav>
                      <nav>< Link to="/signin" className="signin">Sign In</Link></nav>
                  </div>
              </div>
        </div>
        )
        )
      }
    </ClientConsumer>
)
}

export default Header
