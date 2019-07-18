import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={ (props) => (localStorage.getItem("email_address"))
                                         ? ( <Component {...props} /> )
                                         : ( <Redirect to={ { pathname: '/signin',
                                                              state: { from: props.location }
                                                            } }/>)
                            }/>
  );
};
