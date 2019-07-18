/* CourseDetail
  This component provides the "Course Detail" screen by retrieving the detail for a course
    from the REST API's /api/courses/:id route and rendering the course.
  The component also renders a "Delete Course" button that when clicked should send a DELETE request
    to the REST API's /api/courses/:id route in order to delete a course.
  This component also renders an "Update Course" button for navigating to the "Update Course" screen.*/
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import ReactMarkDown from "react-markdown";


// This component provides the "Course Detail" screen by retrieving the detail for a course from the REST API's /api/courses/:id route and rendering the course.

class CourseDetail extends Component {
  constructor() {
    super();
    this.state = {
        course: {},
        id:"",
        creatorName: "",
        userId: "",
    };
  }
// Get a selected course
  componentDidMount(){
    //Request Data
    axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then( (res) => { // response data
        const course = res.data.Course; // store data to the empty object course
        // console.log("res.data: ", res.data);
        // console.log("course: ", course.User.firstName + " " + course.User.lastName);
        // console.log("course id: ", course.id);
        // console.log("course user id: ", course.User.id);
        this.setState({ // Update state
            course: course,
            id: course.id,
            creatorName: course.User.firstName + " " + course.User.lastName,
            userId: course.User.id
        });
        // console.log("Course_Id: ", this.props.match.params.id);
        // console.log("User_Id: ", localStorage.getItem('user_id'));
        // console.log("Username: ", localStorage.getItem('email'));
        // console.log("Password: ", localStorage.getItem('password'));
        // console.log("Name: ", localStorage.getItem('name'));

      })
      .catch( (err) => {
        //link to /notfound if there is no course in database
      if(err.response.status === 404) {
          this.props.history.push("/notfound");
        }
        //link to /error if there is no course in database
        else {
          this.props.history.push("/error");
        }
      })
  };

  //delete a selected Course
  delCourse (e) {
    e.preventDefault();
    //Request Deletion: send a DELETE request to the REST API's /api/courses/:id route in order to delete a course
    axios.delete(`http://localhost:5000/api/courses/${this.props.match.params.id}`
      ,{// check credential
        auth: {
            username: localStorage.getItem('email_address'),
            password: localStorage.getItem('password')
        }
      }
    )
    .then( (res) => {
      // Redirect to courses after deleting the course
      if (res.status === 204) {
        this.props.history.push("/");
      }
      console.log("Course is deleted");
    })
    .catch( (err) => {
      console.log(err.response.status);
      //link to acc page if there is no course in database
      if(err.response.status === 403){
          this.props.history.push('/forbidden')
      }
      //link to notfound page if there is no course in database
      else if(err.response.status === 404) {
        this.props.history.push("/notfound");
      }
      //link to error page if getting fail to delete the course or status: 500
      else {
        this.props.history.push("/error");
      }
    })
  }

  compareUserId(){
    if( parseInt(localStorage.getItem("user_id")) === this.state.userId ){
      return(
        <span>
          {/* Update Course button links to UpdateCourse page */}
          <Link to={`/courses/${this.props.match.params.id}/update`}
                className= "button"> Update Course </Link>
          {/* Delete Course button link to homepage after delete the course*/}
          <Link to="/" className="button" onClick={(e) => this.delCourse(e)}> Delete Course </Link>
        </span>
      )
    }
  }

  render() {
    // const id = this.state.course.id;
    const title= this.state.course.title;
    const description = this.state.course.description;
    const estimatedTime = this.state.course.estimatedTime;
    const materialsNeeded = this.state.course.materialsNeeded;

    return(
      <div>
        {/* 3 options*/}
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {/*Condition to see delete and update course*/}
              {this.compareUserId()}
              <Link to="/" className="button button-secondary"> Return to List </Link>
            </div>
          </div>
        </div>

        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title"> {title} </h3>
              <p> By: {this.state.creatorName}</p>
            </div>

            {/*Course Information*/}
            <div className="course--description">
              {/* Use <ReactMarkdown> component to render the course description property as markdown formatted text. */}
              <ReactMarkDown source={description}/>
            </div>
          </div>

          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">

                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <ReactMarkDown source={estimatedTime} />
                </li>

                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    {/* Use <ReactMarkdown> component to render the materialsNeeded property as markdown formatted text. */}
                    <ReactMarkDown source={materialsNeeded}/>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
    )
  };
}

export default withRouter(CourseDetail);
