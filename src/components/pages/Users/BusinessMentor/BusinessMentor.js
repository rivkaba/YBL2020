import React from "react";
import {auth, getUser, signOut} from '../../../../firebase/firebase';
import './BusinessMentor.css'
import {NextPage} from "../UserPage";
import ClipLoader from "react-spinners/ClipLoader";




class BusinessMentor extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            spinner: [true,'נא להמתין ,הדף נטען'],
            page:'menu',
            user: props.location,
            error:false,
            loadPage:false,
            loading: true,
            rule:"Manager",
            prevDate:'',
            viewStudent: false,
            date:"",
            form : {
                date:"",
                q1:"",
                q2:"",
                q3:"",
                q4:"",
                q5:"", 
                q6:"",
                q7:"",
                q8:"",
                q9:""
            }
        };

    }


    loadSpinner(event,massage = ""){
        var spinner = []
        spinner.push(event)
        spinner.push(massage)
        this.setState({spinner:spinner})
    }



    async componentDidMount() {
        var href =  window.location.href.split("/",5)
        // console.log(href)
        auth.onAuthStateChanged(async user=>{
            if(user)
            {
                var type = await getUser(user)

                if(type === "wait")
                {
                    alert('המנהל עדיין לא אישר את הבקשה')
                    window.location.href = '/Login';
                    return
                }

                if(href[4] === user.uid && (href[3] === type||type==='Tester'))
                {
                    this.setState({
                        isLoad: true,
                        user: user,
                        type: type
                    })
                    this.loadSpinner(false,"")
                    this.setState({loadPage:true})
                    this.render()
                    return
                }
                else
                {

                    this.notfound()
                    return
                }

            }
            else {
                this.setState({
                    isLoad: true,
                })
                window.location.href = '/Login';
                return;

            }

        })
    }


    render() {
if(this.state.loadPage) {
    return (
        <div id="instructor" className="sec-design" dir='rtl'>
            {!this.state.spinner[0] ? "" :
                <div id='fr'>
                    {this.state.spinner[1]}
                    <div className="sweet-loading">
                        <ClipLoader style={{
                            backgroundColor: "rgba(255,255,255,0.85)",
                            borderRadius: "25px"
                        }}
                            //   css={override}
                                    size={120}
                                    color={"#123abc"}

                        />
                    </div>
                </div>
            }
            <h2>Hello {this.state.user.displayName} </h2>
            {/*<h2>Hello Guide {this.state.user.email} </h2>*/}
            <div id="instructor_menu" className="form-design" name="student_form" method="POST">
                <button id="feedback-button" className="btn btn-info" onClick={() => {
                   this.ChangePage("Feedbacks/Guides")
                      return
                }}>הצגת משובי מדריכים<span
                    className="fa fa-arrow-right"></span></button>
                <button id="report-button" className="btn btn-info" onClick={() => {
                    NextPage(this.props, "Profile", this.state.user)
                }}>עדכון פרופיל או סיסמה<span
                    className="fa fa-arrow-right"></span></button>
                <button id="logout" className="btn btn-info" onClick={() => {
                    signOut()
                }}>התנתק
                </button>
                {/*<button id="report-button" className="btn btn-info" onClick={()=>{*/}
                {/*    this.props.history.push({*/}
                {/*        pathname: `User`,*/}
                {/*        data: this.state.user // your data array of objects*/}
                {/*    })}} >חזרה לדף בדיקות<span*/}
                {/*    className="fa fa-arrow-right"></span></button>*/}
            </div>
        </div>
    )
}
    else
        return (<div> {!this.state.spinner[0] ? "" :
            <div id='fr'>
                {this.state.spinner[1]}
                <div className="sweet-loading">
                    <ClipLoader style={{
                        backgroundColor: "rgba(255,255,255,0.85)",
                        borderRadius: "25px"
                    }}
                        //   css={override}
                                size={120}
                                color={"#123abc"}

                    />
                </div>
            </div>
        }</div>)
    }

    notfound()
    {
        this.props.history.push({
            pathname: `/404`,
            data: this.state.user // your data array of objects
        })
    }

    loadUser(page)
    {
        this.props.history.push({
            pathname: `/${page}/${this.state.user.uid}`,
            data: this.state.user // your data array of objects
        })
    }
    
    ChangePage(path) {

        this.props.history.push({
            pathname: `${this.props.location.pathname}/${path}`,
            data: this.state.user
        })

    }

}



export  default  BusinessMentor;