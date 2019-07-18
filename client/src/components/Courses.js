/*  Courses
  This component provides the "Courses" screen by retrieving the list of courses
    from the REST API's /api/courses route and rendering a list of courses.
  Each course needs to link to its respective "Course Detail" screen.
  This component also renders a link to the "Create Course" screen.*/

import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";

class Courses extends Component {
  constructor() {
    super();
    //Set state of courses to empty array
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    //Request the API
    axios.get('http://localhost:5000/api/courses/')
    //Parse output to JSON
    .then( res => {
        this.setState({
          courses: res.data
        })
        // console.log("List of courses: ", res.data);
    })
    //catch errors
    .catch( (err) => {
      if(err.response.stattus === 404){
        this.props.history.push("/notfound");
      }
      else{
      this.props.history.push("/error");
      }
    });
  }

  // display all courses
  displayCourses(){
    return(
      this.state.courses.map((course, index) => (
        <div className="grid-33" key={index}>
          {/*Course Detail*/}
          <NavLink className="course--module course--link" to={`/courses/${course.id}`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </NavLink>
        </div>
      ))
    )
  }

  render() {
    return (
      <div>
        <div className="bounds">
          {/* Display all Courses */}
          {this.displayCourses()}

          {/*Display a Link to Create New Course.*/}
          <div className="grid-33">
            <NavLink className="course--module course--add--module" to={`/courses/create`}>
              <h3 className="course--add--title">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                </svg> New Course</h3>
            </NavLink>
          </div>
        </div>
      </div>
    )};
}

export default withRouter (Courses)
