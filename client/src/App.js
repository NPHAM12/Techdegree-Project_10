import React, {Component} from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Route, Redirect, Switch, withRouter } from "react-router-dom";

// import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import {ClientProvider} from './components/ClientContext'
//import Course components
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';

// import Error components
import Error from './components/Error';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';

//import signIn/signOut/signUp component
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';

// import PrivateRoute component
import PrivateRoute from './components/PrivateRoute';

class App extends Component {
  constructor() {
    super();
    //initial state
    this.state = {
      user : {},
      username : "",
      password : "",
      status:"",
      signedIn : false,
      authError:""
    };
  }

  //signOut funtion that removes the currently saved user
  signOut = () => {
    this.setState({
      user : {},
      username : "",
      password : "",
    })
    localStorage.clear();
    console.log("User signed out")
  }

  signIn = (email_address, password) => {
    axios.get("http://localhost:5000/api/users",
      {
        auth : {
          username : email_address,
          password : password
        }
      }
    )
    .then( (res) => {
      if(res.status === 200) { // user credentials are valid
        const user = res.data.user;
        // // console.log("User ", user);
        // //User: {user: { emailAddress: "joe@smith.com",
        // //               firstName: "Joe",
        // //              lastName: "Smith",
        // //              id: 1,
        //                 ...}}
        this.setState({
          user : user,
          username : user.emailAddress,
          password : user.password,
          status: res.status
        })
        localStorage.setItem("name", user.firstName + " " + user.lastName);
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("email_address", email_address);
        localStorage.setItem("password", password);
        this.props.history.push("/");
      }
    })
    .catch( (err) => {
      if(err.response.status === 401 || err.response.status === 400){
        this.setState({
          authError: "Unauthorized!!!",
          status: err.response.status
        })
      }
      else{ //recommend sign up a new account
        this.props.history.push("/error")
        console.log(err);
      }
    })
  }

  render(){
    return(
      <ClientProvider
      value={{
        signIn : this.signIn.bind(this),
        signOut : this.signOut.bind(this)
      }}>
        <div className='App'>
          <Header/>

          <Switch>

            {/* root route redirects to /courses */}
            <Route exact path="/" render={ () => <Redirect to="/courses/" /> } />

            <Route exact path="/courses" render={ () => <Courses /> } />
            <PrivateRoute exact path="/courses/create" component={CreateCourse} />
            <PrivateRoute exact path="/courses/:id/update" component={ UpdateCourse } />
            <Route exact path="/courses/:id" component={ CourseDetail } />

            {/* Sign In Page*/}
            <Route exact path="/signin" render= {() => <UserSignIn  status={this.state.status}/>} />

            {/* Sign Out Page*/}
            <Route exact path="/signout" component= {UserSignOut} />

            {/* Sign Up Page*/}
            <Route exact path="/signup" component= {UserSignUp} />

            {/* Error Pages*/}
            <Route path="/error" component = {Error} />
            <Route path="/forbidden" component = {Forbidden} />
            <Route path="/notfound" component = {NotFound} />

          </Switch>
        </div>
        </ClientProvider>
    );
  }
}
// export default App;
export default withRouter (App);
