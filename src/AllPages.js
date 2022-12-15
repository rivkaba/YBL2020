

import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import HomePage from './components/pages/HomePage/HomePage';
import SignUp from './components/pages/SignUp/signUp';
import Login from './components/pages/Login/Login';
import resetPassword from './components/pages/Login/resetPassword';

import UserPage from "./components/pages/Users/UserPage";
import Students from './components/pages/Users/Student/Students';
import BusinessMentor from './components/pages/Users/BusinessMentor/BusinessMentor';
import Guides from "./components/pages/Users/Guide/Guide";
import Managers from './components/pages/Users/Manager/Manager';
import test_g_a_r from "./components/pages/Users/Guide/test_g_a_r";
import test_g_f from "./components/pages/Users/Guide/test_g_f";


import TempStudent from "./components/pages/Users/Student/TempStudent";
import TempGuide from "./components/pages/Users/Guide/TempGuide";
import TempManager from './components/pages/Users/Manager/TempManager';
import UserApproval from "./components/pages/Users/Manager/UserApproval";
import notFound from "./404";
import AttendReport from "./components/pages/Users/Manager/mngAttendReport";
import FeedbackStudents from "./components/pages/Users/Manager/mngStudFeedback";
import FeedbackTrips from "./components/pages/Users/Manager/MngTrips";
import FeedbackGuides from "./components/pages/Users/Manager/mngGuideFeedback";
import UpdatesFirebase from "./components/pages/Users/Manager/UpdatesFirebase";
import StudentFeedback from "./components/pages/Users/Student/stud_feedback";
import StudentOpened from "./components/pages/Users/Student/stud_opened";
//import StudentSummary from "./components/pages/Users/Student/stud_summary";
import bmGuideFeedback from "./components/pages/Users/BusinessMentor/bmGuideFeedback";
import Profile from "./components/pages/Users/profile";
import GuideReports from "./components/pages/Users/Guide/guide_attend_report";
import TripReport from "./components/pages/Users/Guide/TripReport";
import GuideFeedback from "./components/pages/Users/Guide/guide_feedback";
import Wait from "./components/pages/Users/await";

function LoadPage() {
    return (
        <div>
            <Router>
                <Switch>
                    {/*<Route exact path="/">*/}
                    {/*    <Login />*/}
                    {/*</Route>*/}

                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/wait/:id" component={Wait} />
                    <Route exact path="/Login" component={Login} />
                    <Route exact path="/Login/:404" component={notFound} />
                    <Route exact path="/resetPassword" component={resetPassword} />
                    <Route exact path="/resetPassword/:404" component={notFound} />
                    <Route exact path="/SignUp" component={SignUp} />
                    <Route exact path="/SignUp/:404" component={notFound} />
                    <Route exact path="/User" component={UserPage} />
                    <Route exact path="/User/:404" component={notFound} />


                    <Route exact path="/Student/:id" component={Students} />
                    <Route exact path="/Student/:id/Feedback" component={StudentFeedback} />
                    <Route exact path="/Student/:id/Opened" component={StudentOpened} />
                   {/* <Route exact path="/Student/:id/Summary" component={StudentSummary} />*/}

                    <Route exact path="/Student/:id/Profile" component={Profile} />
                    <Route exact path="/Student/:id/:404" component={notFound} />
                    <Route exact path="/Student/:id/:page/:404" component={notFound} />


                    <Route exact path="/Guide/:id" component={Guides} />
                    <Route exact path="/Guide/:id/Reports" component={GuideReports} />
                    <Route exact path="/Guide/:id/Feedback" component={GuideFeedback} />
                    <Route exact path="/Guide/:id/Trips" component={TripReport} />
                    <Route exact path="/Guide/:id/profile" component={Profile} />
                    <Route exact path="/Guide/:id/:404" component={notFound} />
                    <Route exact path="/Guide/:id/:page/:404" component={notFound} />

                    
                    <Route exact path="/BusinessMentor/:id" component={BusinessMentor} />
                    <Route exact path="/BusinessMentor/:id/Feedbacks/Guides" component={bmGuideFeedback} />
                    <Route exact path="/BusinessMentor/:id/profile" component={Profile} />
                    <Route exact path="/BusinessMentor/:id/:404" component={notFound} />
                    <Route exact path="/BusinessMentor/:id/:page/:404" component={notFound} />


                    <Route exact path="/Manager/:id" component={Managers} />
                    <Route exact path="/Manager/:id/UserApproval" component={UserApproval} />
                    <Route exact path="/Manager/:id/Updates" component={UpdatesFirebase} />
                    <Route exact path="/Manager/:id/Reports" component={AttendReport} />
                    <Route exact path="/Manager/:id/Feedbacks/Guide" component={FeedbackGuides} />
                    <Route exact path="/Manager/:id/Feedbacks/Student" component={FeedbackStudents} />
                    <Route exact path="/Manager/:id/Feedbacks/Trips" component={FeedbackTrips} />

                    <Route exact path="/Manager/:id/profile" component={Profile} />
                    <Route exact path="/Manager/:id/:404" component={notFound} />
                    <Route exact path="/Manager/:id/:page/:404" component={notFound} />





                    {/*Student pages*/}
                    <Route exact path="/TempStudent" component={TempStudent} />
                    <Route exact path="/TempStudent/Feedback" component={StudentFeedback} />
                    <Route exact path="/TempStudent/Profile" component={Profile} />


                    {/*guide pages*/}
                    <Route exact path="/TempGuide" component={TempGuide} />
                    <Route exact path="/TempGuide/Reports" component={GuideReports} />
                    <Route exact path="/TempGuide/Feedback" component={GuideFeedback} />
                    <Route exact path="/TempGuide/profile" component={Profile} />


                    
               

                    {/*managers pages*/}
                    <Route exact path="/TempManager" component={TempManager} />
                    <Route exact path="/TempManager/UserApproval" component={UserApproval} />
                    <Route exact path="/TempManager/Updates" component={UpdatesFirebase} />
                    <Route exact path="/TempManager/Reports" component={AttendReport} />
                    <Route exact path="/TempManager/Feedbacks/Guide" component={FeedbackGuides} />
                    <Route exact path="/TempManager/Feedbacks/Student" component={FeedbackStudents} />
                    <Route exact path="/TempManager/profile" component={Profile} />


                    <Route exact path="/test_g_a_r" component={test_g_a_r} />
                    <Route exact path="/test_g_f" component={test_g_f} />
                    <Route exact path="/:404" component={notFound} />
                </Switch>
            </Router>
        </div>
    );
}

export default LoadPage;


// {<Route exact path='/home' exact component={HomePage}/>}
// {<Route exact path="/login/:id" component={Home} />}