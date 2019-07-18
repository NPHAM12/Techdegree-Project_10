/* UserSignUp
  This component provides the "Sign Up" screen by rendering a form
    that allows a user to sign up by creating a new account.
  The component also renders a "Sign Up" button that when clicked
    sends a POST request to the REST API's /api/users route and signs in the user.
  This component also renders a "Cancel" button that returns the user
    to the default route "/" (i.e. the list of courses).
*/

import React, {Component} from "react"
import {Link, withRouter} from 'react-router-dom'
import {ClientConsumer} from './ClientContext'
import axios from 'axios'

class UserSignUp extends Component {

  constructor() {
    super()
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword : "",
      validationError : []
    }
  }

  //handles the subming of new users
  addNewUser = (e, fn, ln, email_address, password, confirmPassword, signIn) => {
    e.preventDefault();
    const message = [];
    const badReq = [];
    const warning1 = 'Missing: "First Name" "Last Name" "Email Address" or "Password"!'
    const warning2 = 'Confirm Password is not match with Password';

    //Check all inputs in textfield
    if(!fn || !ln || !email_address || !password){
      message[0]= `${warning1}`;

    } else if(password !== confirmPassword){
      message[0]= `${warning2}`;
    }

    // Update state for validationError
     this.setState({
       validationError: message
     })

     // if there is no error -> post a new user to users database
     if(message.length === 0) {
      axios.post("http://localhost:5000/api/users", {
        firstName: fn,
        lastName: ln,
        emailAddress: email_address,
        password: password
      })
      .then( (res) => {
        if(res.status === 201) { // sign up successfully -> sign in with the new acc
          signIn( email_address, password); // call signIn from App.js
        }
          this.props.history.push("/") // then redirect to homepage "/"
      })
      .catch( (err) => {
        // Exist Email -> Failed create a new user
        if(err.response.status === 400){
          // validation errors returned from the REST API api/routes/users.js.
          badReq[0] = `${err.response.data.message}`;
          this.setState({
            validationError: badReq,
          });
        }
      })
      //reset validationError
      this.setState({
        validationError : []
      })
    }
}

  // Get input value from textfield -> update state
  getInput(e){
      let input = e.target
      this.setState({[input.name]: input.value});
  }

  // Cancel Action -> back to homepage
  makeCancel = (e) => {
    this.props.history.push("/");
  };

  //Check validation
  validationCheck() {
    // console.log("validation Error: ", this.state.validationError);
    if(this.state.validationError.length > 0){
      return (
        <div>
        <h2 className="validation--errors--label">Validation errors</h2>
        <div className="validation-errors">
            <ul>
              {this.state.validationError.map( (validation, index) => {
                  return(
                    <h3 key={ index }> { validation } </h3>
                  );
                })
              }
            </ul>
          </div>
        </div>
      )
    }
  }

  //renders form to sign up new user
  render() {

    // get value into state from textfield by getInput() -> assign to variables -> arugments in addNewUser()
    const fn = this.state.firstName;
    const ln = this.state.lastName;
    const email_address = (this.state.emailAddress).toLowerCase();
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    return (
      <ClientConsumer>
        {({signIn}) =>
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign Up</h1>
            {/* Show Validation*/}
            {this.validationCheck()}

            {/*From Sign Up*/}
            <form onSubmit={ (e) => this.addNewUser(e, fn, ln, email_address, password, confirmPassword, signIn)}>
              <div>
                <input id="firstName" name="firstName" type="text" className=""
                       placeholder="First Name" defaultValue=""  onChange={(e) => this.getInput(e)}/>
              </div>

              <div>
                <input id="lastName" name="lastName" type="text" className=""
                       placeholder="Last Name" defaultValue=""
                       onChange={(e) => this.getInput(e)}/>
              </div>

              <div>
                <input id="emailAddress" name="emailAddress" type="text" className=""
                       placeholder="Email Address" defaultValue=""
                       onChange={(e) => this.getInput(e)}/>
              </div>

              <div>
                <input id="password" name="password" type="password" className=""
                       placeholder="Password" defaultValue=""
                       onChange={(e) => this.getInput(e)}/>
              </div>

              <div>
                <input id="confirmPassword" name="confirmPassword" type="password"
                  className="" placeholder="Confirm Password" defaultValue=""
                  onChange={(e) => this.getInput(e)}/>
              </div>

              <div className="grid-100 pad-bottom">
                <button className="button" type="submit"> Sign Up </button>
                <button className="button button-secondary" type="reset"
                  onClick={this.makeCancel}> Cancel </button>
              </div>
            </form>
            <p>Already have a user account? <Link to="/signin"> Click here </Link> to sign in!</p>
          </div>
        </div>
        }
      </ClientConsumer>
    )
  }
}
export default withRouter(UserSignUp)
