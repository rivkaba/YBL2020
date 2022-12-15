import React from "react";
import {auth, db, getUser, signOut, getGuide} from '../../../../firebase/firebase'
import { RadioGroup ,FormControlLabel, Radio } from '@material-ui/core';
import ClipLoader from "react-spinners/ClipLoader";
import {useParams} from 'react-router-dom';



class TripReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadPage:false,
            spinner: [true,'נא להמתין הדף נטען'],
            isLoad:false,
            error:false,
            loading: true,
            page:'menu',
            rule:"Student",
            form: {
                id: this.props.match.params.id,
            },            

        };

        this.handleSearchChange1 = (e, { searchQuery }) => this.setState({ searchQuery })
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    async handleChange(event)
    {
        var nameValue = event.target.name;
        var value = event.target.value.toString();

        this.setState(prevState => ({
            form: {
              ...prevState.form,
              [nameValue]: value,
            }
        }));

    }

    sendDataToFirebase = async (collection) => {
        //Send data to firebase
        this.loadSpinner(true,"שולח נתוני נסיעות")
        var path = auth.currentUser.uid;

        try {
            var date = new Date();
            var day = date.getDate(); var month = date.getMonth() + 1; var year = date.getFullYear();
            
            var curDate = `${day}/${month}/${year}`.trim();
            // var finalForm = {[curDate]: this.state.form};
            var displayName = this.state.user.displayName;
            console.log('displayName', displayName)
            var finalForm = {...this.state.form, displayName}


            await db.collection("guides").doc(path).collection('trips').doc(this.state.form.date).set(finalForm).then(async()=>{
                 alert(" תודה, הטופס נשלח בהצלחה")
                 window.location.reload(true);
            });
        } catch(error) {
            alert(error.message)
            this.loadSpinner(false)
        }


        this.loadSpinner(false)

    }

    handleSubmit = (event) =>
    {
        console.log('submit')
        console.log('event', event);
        for (const key in this.state.form) {
            if (this.state.form[key] == "") {
                alert('יש למלא את כל השדות')
            } else {
                this.sendDataToFirebase()
            }
        } 
    }


    loadPage(event){
        this.setState({loading:event})
        //    this.render()
    }

    async componentDidMount() {
        var href =  window.location.href.split("/",5)
        // console.log(href)
        auth.onAuthStateChanged(async user=>{
            if(user)
            {
                var type = await getUser(user)
                console.log('user',user)
                console.log('type',type)
                if(href[4] === user.uid && (href[3] === type||type==='Tester'))
                {
                    this.setState({
                        isLoad: true,
                        user: user,
                        type: type
                    })
                    this.render()
                    this.setState({loadPage:true})
                    this.loadSpinner(false,"")
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


        // var user = (auth.currentUser).uid
        // var guide = await getGuideData(user)

    }

    loadSpinner(event,massage = ""){
        var spinner = []
        spinner.push(event)
        spinner.push(massage)
        this.setState({spinner:spinner})
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
    loadTempPage(page)
    {
        this.props.history.push({
            pathname: `/${page}`,
            data: this.state.user // your data array of objects
        })
    }
    BackPage()
    {
        this.props.history.push({
            pathname: `/Student/${this.state.user.uid}`,
            data: this.state.user // your data array of objects
        })
    }


    
    render() {

        if(this.state.loadPage)
        {
        return (<div>
            {!this.state.spinner[0] ? "" :
                <div id='fr'>
                    {this.state.spinner[1]}
                    <div className="sweet-loading">
                        <ClipLoader style={{
                            backgroundColor: "rgba(255,255,255,0.85)",
                            borderRadius: "25px"
                        }}
                            size={120}
                            color={"#123abc"}
                        />
                    </div>
                </div>
            }

            <div id="attendreport" className="sec-design" dir='rtl'>
                <h2>שלום {this.state.user.displayName} </h2>

                <div id="box" className="chekbox">
                    <label id="checkbox" className="title-input" htmlFor="name">
                    תאריך                    </label>
                    <input type="date" className="form-control" id="insert-date" name="date"
                        onChange={this.handleChange}   required/>

                    <label id="checkbox" className="title-input" htmlFor="name">מאיפה</label>   
                    <input type="text" className="form-control" 
                    style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                    name="from" placeholder="מאיפה"
                    minLength="10" onChange={this.handleChange} required/>

                    <label id="checkbox" className="title-input" htmlFor="name">לאיפה</label>   
                    <input type="text" className="form-control" 
                    style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                    name="to" placeholder="לאיפה"
                    minLength="10" onChange={this.handleChange} required/>

                    <label id="checkbox" className="title-input" htmlFor="name">מטרה</label>   
                    <input type="text" className="form-control" 
                    style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                    name="goal" placeholder="מטרה"
                    minLength="10" onChange={this.handleChange} required/>

                    <label id="checkbox" className="title-input" htmlFor="name">הערות</label>   
                    <input type="text" className="form-control" 
                    style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                    name="remarks" placeholder="הערות"
                    minLength="10" onChange={this.handleChange} required/>


<label id="checkbox" className="title-input" htmlFor="name">סה"כ</label>   
                    <input type="text" className="form-control" 
                    style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                    name="total" placeholder='סה"כ'
                    minLength="10" onChange={this.handleChange} required/>         
        </div>

        <button id="confirm-form" className="btn btn-info" onClick={this.handleSubmit}>דווח נסיעות
                </button>
                <button id="feedback-button" className="btn btn-info" onClick={() => {
                    this.loadPage()
                    this.BackPage()
                }}>חזרה לתפריט
                </button>
                <button id="logout" className="btn btn-info" onClick={() => {
                    signOut()
                }}>התנתק
                </button>
</div></div>);
   
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

    loadUser(page)
    {
        this.props.history.push({
            // pathname: `/${page}/${this.state.user.id}`,
            pathname: `/Temp${page}`,
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


export  default  TripReport;