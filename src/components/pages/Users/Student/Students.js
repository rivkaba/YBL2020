import React from "react";
import {auth, db ,getUser, signOut} from '../../../../firebase/firebase'
import {NextPage} from "../UserPage";
import ClipLoader from "react-spinners/ClipLoader";
 var exist1=true;

class Student extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadPage:false,
            user: props.location,
            spinner: [true,'נא להמתין הדף נטען'],
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




    loadTempPage(page)
    {
        this.props.history.push({
            pathname: `/${page}`,
            data: this.state.user // your data array of objects
        })
    }

    async  logout() {
        //מסך טעינה
        await auth.signOut();
        window.location.href = '/';
        //סיום מסך טעינה
    }

    chooseLayout(page)
    {
        this.setState({
            page:page,
        })
        this.render()
    }



    render() {
        if(this.state.loadPage) {
            return (
                <div id="instructor" className="sec-design" dir="rtl">

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
                    <h2> שלום {this.state.user.displayName} </h2>
                    <form id="instructor_menu" className="form-design" name="student_form" method="POST">
                        <button id="feedback-button" className="btn btn-info" onClick={() => {
                            NextPage(this.props, "Feedback", this.state.user)
                        }}>מילוי משוב<span
                            className="fa fa-arrow-right"></span></button>
                          <button id="feedback-button" className="btn btn-info" onClick={async() => {
                          //await this.exist();
                        

                                    NextPage(this.props, "Opened", this.state.user)
                             //  }
                         /* }
                          else{
                              alert(exist1)
                        NextPage(this.props, "Profile", this.state.user)
                          }*/
                        }}>שאלון הפתיחה<span
                            className="fa fa-arrow-right"></span></button>
                          <button id="feedback-button" className="btn btn-info" onClick={async() => {
                            // this.exsist()
                            //  if(this.exsist()===false){
                                    NextPage(this.props, "Summary", this.state.user)
                        }}>שאלון סיום<span
                            className="fa fa-arrow-right"></span></button>
                        <button id="report-button" className="btn btn-info" onClick={() => {
                        NextPage(this.props, "Profile", this.state.user)
                        }}>עדכון פרטים או סיסמא<span
                            className="fa fa-arrow-right"></span></button>
                        <button id="logout" className="btn btn-info" onClick={() => {
                            signOut()
                        }}>התנתק
                        </button>
                        {/*<button id="report-button" className="btn btn-info" onClick={()=>{*/}
                        {/*    this.props.history.push({*/}
                        {/*    pathname: `User`,*/}
                        {/*    data: this.state.user // your data array of objects*/}
                        {/*})}} >חזרה לדף בדיקות<span*/}
                        {/*    className="fa fa-arrow-right"></span></button>*/}
                    </form>
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
   async existss(){
    var path = auth.currentUser.uid;
   /* // try{
        var exsist4= await db.collection("students").doc(path).collection('Opening questionnaire').get()
                            if(!exsist4.empty){ 
                                console.log("exsist4",exsist4)
                            alert("כבר מלאת שאלון פתיחה")
                           // this.setState({exsist:true});
                            exsist1=true;
                            //console.log(this.state.exsist)
                             console.log("exsist4",exsist4)

                            }else
                          // this.setState({exsist:false});
                            exsist1=false;
     //   } catch(error) {
          // alert(error.message)
           // this.loadSpinner(false)
     //  }*/
      db.collection("students").doc(path).collection('Opening questionnaire').doc("form").get()
                .then(async(doc) => {
    if (doc.exists)
    { 
       //  /*   if(questionnaire.exists)
          //  { 
                alert("כבר מלאת שאלון פתיחה")
                exist1=true;
                console.log("exsist1",exist1)
    }else
    {
                            exist1=false;
    
                            console.log("exsist1",exist1)
    }
                });
  
       // })
    }
      

    ////////////
  
    loadUser(page)
    {
        this.props.history.push({
            pathname: `/${page}/${this.state.user.uid}`,
            data: this.state.user // your data array of objects
        })
    }

    notfound()
    {
        this.props.history.push({
            pathname: `/404`,
            data: this.state.user // your data array of objects
        })
    }
}


export  default  Student;