/* CreateCourse
  This component provides the "Create Course" screen by rendering a form that allows a user to create a new course.
  The component also renders a "Create Course" button that when clicked sends
    a POST request to the REST API's /api/courses route.
  This component also renders a "Cancel" button
    that returns the user to the default route "/" (i.e. the list of courses).
*/

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import axios from 'axios';

class CreateCourse extends Component {
  //Initialize state
  constructor() {
    super()
    this.state = {
      title: "",
      description: "",
      estimatedTime: "",
      materialsNeeded: "",
      userId:"", // FOREIGN KEY constraint
      validationError: [],
    }
  }

  // Create a New Course
  addNewCourse = (e) => {
    e.preventDefault();
    const message = [];
    const badReq = [];
    const warning = 'Please provide a value for "Title" and/or "Description"!';

    //Check all inputs in textfield of title or description
    if(!this.state.title || !this.state.description){
      message[0]= `${warning}`;
    }
    // Update state for validationError
     this.setState({
       validationError : message
     })

     // if there is no error -> post a new course to courses database
     if(message.length === 0) {
       axios.post("http://localhost:5000/api/courses",
        {
          title: this.state.title,
          description: this.state.description,
          estimatedTime: this.state.estimatedTime,
          materialsNeeded: this.state.materialsNeeded,
          userId : localStorage.getItem("user_id")
        },
        {// check credential
          auth: {
              username: localStorage.getItem('email_address'),
              password: localStorage.getItem('password')
          }
        }

      )
      .then( (res) => {
        // successful add a new course -> return to the home page
        if(res.status === 201) {
          this.props.history.push("/")
        }
      })
      .catch( (err) => {
          // Access Denied! -> Failed authorization
          // Exist course
          if (err.response.status === 400) {
            // validation errors returned from the REST API api/routes/authenticateUser.js.
            // const error = err.response.data.message.split("\n");
            badReq[0] = `${err.response.data.message}`;
            this.setState({
              validationError: badReq,
            });
          }else if(err.response.status === 401){
            this.props.history.push("/forbidden");

          }
          else {
            this.props.history.push("/error");
          }
        }
      )
      //reset validationCheck
      this.setState({
        validationError: []
      });
    }
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

  //Check validation
  validationCheck() {
    if(this.state.validationError.length > 0){
      return (
        <div>
          <h2 className="validation--errors--label">Validation Errors</h2>
          <div className="validation-errors">
            <ul>
              {this.state.validationError.map( (validation, index) => {
                  return(
                    <h3 key={index}> {validation} </h3>
                  );
                })
              }
            </ul>
          </div>
        </div>
      )
    }
  }
  //renders form for new course to be made
  render() {

    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <div>
          {/* Show Validation Error*/}
          {this.validationCheck()}

          {/*Form Create a New Course*/}
          <form onSubmit={ (e) => this.addNewCourse(e)}>
          {/*Left section: Course Title & Description*/}
            <div className="grid-66">
              {/*Course Title*/}
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    onChange={ (e) => this.getInput(e)}
                    defaultValue=""/>
                </div>
                <p>By: {localStorage.getItem("name")}</p>
              </div>

              {/*Course Description*/}
              <div className="course--description">
                <div>
                  <textarea id="description" name="description" placeholder="Course description..."
                    onChange={ (e) => this.getInput(e)}
                    defaultValue=""/>
                </div>
              </div>
            </div>

            {/*Right section: Estimated Time & Materials Needed*/}
            <div className="grid-25 grid-right">

              <div className="course--stats">
                <ul className="course--stats--list">
                  {/*Estimated Time*/}
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input id="estimatedTime" className="course--time--input" name="estimatedTime" type="text" placeholder="Hours..."
                        onChange={ (e) => this.getInput(e)}
                        defaultValue=""/>
                    </div>
                  </li>

                  {/*Materials Needed*/}
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..."
                        onChange={ (e) => this.getInput(e)}
                        defaultValue=""/>
                    </div>
                  </li>

                </ul>
              </div>
            </div>

            {/*Buttons*/}
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit"> Create Course </button>
              <button className="button button-secondary" type="reset"
                onClick={ (e) => this.makeCancel(e)}> Cancel  </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateCourse)
