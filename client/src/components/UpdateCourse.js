/* UpdateCourse
  This component provides the "Update Course" screen by rendering a form that allows a user
    to update one of their existing courses.
  The component also renders an "Update Course" button that when clicked sends
    a PUT request to the REST API's /api/courses/:id route.
  This component also renders a "Cancel" button
    that returns the user to the "Course Detail" screen.
*/
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from "axios";

class  UpdateCourse extends Component{

  //Initialize state
  constructor() {
    super();
    this.state = {
        course: {},
        // courseId: "", // not this because the model for your Course uses "id"
        id: "", // don't miss the course id -> "WHERE parameter \"id\" has invalid \"undefined\" value"
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
        creatorName: "",
        validationError:[],
        loading: false, // in order to fix the defaultValue in textarea
    };
  }

  // Render a selected course
  componentDidMount(){
    //Request Data
    this.setState({id : this.props.match.params.id})
    axios.get('http://localhost:5000/api/courses/' + this.props.match.params.id)
    .then(res => {
      const course = res.data.Course;

      this.setState({
        course : res.data.Course,
        // get update contents
        id : this.props.match.params.id,
        title : course.title,
        estimatedTime : course.estimatedTime,
        description : course.description,
        materialsNeeded : course.materialsNeeded,
        // get user Fullname
        creatorName: course.User.firstName + " " + course.User.lastName,
        loading: true
      });
    })
  };

  updateCourse (e) {
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
     // if there is no error -> send a put request to uddate the course
    if(message.length === 0) {
      //Request Put: sends a PUT request to the REST API's /api/courses/:id route.
      axios.put(`http://localhost:5000/api/courses/${this.props.match.params.id}`,
        {
          id: this.state.id,
          title: this.state.title,
          description: this.state.description,
          estimatedTime: this.state.estimatedTime,
          materialsNeeded: this.state.materialsNeeded,
        }
        ,{// check credential
          auth: {
              username: localStorage.getItem('email_address'),
              password: localStorage.getItem('password')
          }
        }
      )
      .then( (res) => {
        if(res.status === 204) {
          this.props.history.push(`/courses/${this.props.match.params.id}`);
        }
        // console.log("Status: ", res.status);
        console.log("Course is updated!");
      })
      .catch( (err) => {
        // Access Denied! -> Failed authorization
          if (err.response.status === 400) {
            // validation errors returned from the REST API api/routes/authenticateUser.js.
            // const error = err.response.data.message.split("\n");
            badReq[0] = `${err.response.data.message}`;
            this.setState({
              validationError: badReq,
            });
          }
          else {
            this.props.history.push("/error");
          }
        }
      )
      // reset validationError
      this.setState({
        validationError: []
      });
  }}

  // Get input value from textfield -> update state
  getInput(e){
      let input = e.target
      this.setState({[input.name]: input.value});
  }

  // Cancel Action -> back to course details
  makeCancel(e){
    e.preventDefault();
    this.props.history.push(`/courses/${this.props.match.params.id}`);
  };

  //Check validation
  validationCheck() {
    if(this.state.validationError.length > 0){
      return (
        <div>
        <h2 className="validation--errors--label">Validation errors</h2>
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

  //renders form to take userName and password and passes signIn function from app.js
  render() {
    // As the page changes, these values below are never getting updated.
    // const title= this.state.course.title;
    // const description = this.state.course.description;
    // const estimatedTime = this.state.course.estimatedTime;
    // const materialsNeeded = this.state.course.materialsNeeded;

    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {/* Show Validation*/}
          {this.validationCheck()}

        {/*Form Create a New Course*/}
        {
          (this.state.loading)
          ? <form onSubmit={ (e) => this.updateCourse(e)}>
          {/*Left section: Course Title & Description*/}
            <div className="grid-66">
              {/*Course Title*/}
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    onChange={(e) => this.getInput(e)}
                     defaultValue={this.state.course.title}/>
                </div>
                <p> By: {this.state.creatorName}</p>
              </div>

              {/*Course Description*/}
              <div className="course--description">
                <div>
                  <textarea
                    id="description" name="description" placeholder="Course description..."
                    onChange={(e) => this.getInput(e)}
                    defaultValue={this.state.course.description}
                    />
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
                        onChange={(e) => this.getInput(e)}
                        defaultValue={this.state.course.estimatedTime}/>
                    </div>
                  </li>

                  {/*Materials Needed*/}
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..."
                        onChange={(e) => this.getInput(e)}
                        defaultValue={this.state.course.materialsNeeded}/>
                    </div>
                  </li>

                </ul>
              </div>
            </div>

            {/*Buttons*/}
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit"> Update Course </button>
              <button className="button button-secondary" type="reset"
                onClick={ (e) => this.makeCancel(e)}> Cancel  </button>
            </div>
          </form>
          : ("")
        }
      </div>
    </div>
    )
  }
}

export default withRouter(UpdateCourse)
