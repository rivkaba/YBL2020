import React from "react";
import firebase, {auth,db} from '../../../firebase/firebase'



class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    async componentDidMount() {
        auth.onAuthStateChanged(user=>{
            if(user)
            {
                this.setState({
                    isLoad:true,
                    user:user,
                })

            }
            else {
                this.setState({
                    isLoad: true,
                })
                window.location.href = '/Login';
                return;

            }
            this.render()
        })

    }


    async  logout() {
        //מסך טעינה
        await auth.signOut();
        window.location.href = '/';
        //סיום מסך טעינה
    }



    render() {

        return (
            <div id="instructor" className="sec-design">
                {/* <div> Hello Manager {this.state.user.email}</div> */}
                <button id="report-button" className="btn btn-info"onClick={()=>{
                    this.ChangePage("UserApproval")
                    return
                }} >אישור משתמשים<span
                    className="fa fa-arrow-right"></span></button>
                <button id="report-button" className="btn btn-info"onClick={()=> {
                    this.ChangePage("Updates")
                    return
                }} >עדכון ופעולות<span
                    className="fa fa-arrow-right"></span></button>

                <button id="report-button" className="btn btn-info" onClick={()=>{
                    this.ChangePage("Reports")
                    return
                }} >צפייה בדו"ח נוכחות<span
                    className="fa fa-arrow-right"></span></button>
                <button id="feedback-button" className="btn btn-info" onClick={()=>{
                    this.ChangePage("Feedbacks/Student")
                    return
                }} >צפייה במשובי חניכים<span
                    className="fa fa-arrow-right"></span></button>
                <button id="feedback-button" className="btn btn-info" onClick={()=>{
                    this.ChangePage("Feedbacks/Guide")
                    return
                }}>צפייה במשובי
                    מדריכים<span
                        className="fa fa-arrow-right"></span></button>
                <button id="logout" className="btn btn-info" >התנתק</button>
                <button onClick={() => this.loadTempPage("User")}>חזרה להמשך בדיקות דפים</button>
            </div>
        );
    }



    ChangePage(path) {

        this.props.history.push({
            pathname: `${this.props.location.pathname}/${path}`,
        })
        return
    }


}


export  default  Profile;