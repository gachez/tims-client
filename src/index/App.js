import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './App/Login';
import Dashboard from './App/Dashboard';
import UserDashboard from './App/UserDashboard';

const App = () =>{
    
                return(

                             <BrowserRouter>
                                 <Switch>
                                 <Route exact path={"/"} component={Login}></Route>
                                 <Route exact path={"/dashboard"} component={Dashboard}></Route>
                                 <Route exact path={"/user-dashboard"} component={UserDashboard}></Route>
                                 </Switch>
            </BrowserRouter>
                      
                        
                                  
                        
        )
    
}

export default App;