/* UserSignIn
  This component provides the "Sign In" screen by rendering a form
    that allows a user to sign using their existing account information.
  The component also renders a "Sign In" button that when clicked signs in the user
    and a "Cancel" button that returns the user to the default route "/" (i.e. the list of courses).
*/

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {ClientConsumer} from './ClientContext'

class  UserSignIn extends Component{

  //Initialize state
  constructor() {
    super()
    this.state = {
      emailAddress : "",
      password : "",
    }
  }

  // function that handles submit for user signin, and calls the sign in function rom the app.js
  makeSubmit = (e, signIn) => {
    e.preventDefault();
    this.setState({
      emailAddress: this.state.emailAddress,
      password: this.state.password
    })
    console.log("email: ", this.state.emailAddress);
    console.log("password: ", this.state.password);

    //signIn from React.Context that takes takes a username and password
    signIn( this.state.emailAddress, this.state.password)
  }

  // Get input value from textfield -> update state
  getInput(e){
      let input = e.target
      this.setState({[input.name]: input.value});
  }

  // Cancel Action -> back to homepage
  makeCancel(e){
    e.preventDefault();
    this.props.history.push("/");
  };

  // Check validation
  validationCheck() {
    if(this.props.status === 400 || this.props.status === 401){
      return (
        <div>
          <h2 className="validation--errors--label">Validation error</h2>
          <div className="validation-errors">
            <ul>
              <li>Sign-In was unsuccessful!</li>
            </ul>
          </div>
        </div>
      )
    }
  }
  //renders form to take userName and password and passes signIn function from app.js
  render() {

    return (
      <ClientConsumer>{ ({signIn}) =>
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            {/* Show Validation Error*/}
            {this.validationCheck()}

            <form onSubmit={e => this.makeSubmit(e, signIn)}>
              <div>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" defaultValue=""
                  onChange={(e) => this.getInput(e)} />
              </div>

              <div>
                <input id="password" name="password" type="password" className="" placeholder="Password" defaultValue=""
                onChange={(e) => this.getInput(e)} />
              </div>

              <div className="grid-100 pad-bottom">
                <button className="button" type="submit"> Sign In </button>
                <button className="button button-secondary" type="reset"
                  onClick={ (e) => this.makeCancel(e)}> Cancel
                </button>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup"> Click here </Link> to sign up!</p>
        </div> }
      </ClientConsumer>
  )
  }
}

export default withRouter(UserSignIn)
