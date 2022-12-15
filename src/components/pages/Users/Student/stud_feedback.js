import React from "react";
import {auth, db, getUser, signOut} from '../../../../firebase/firebase'
import { RadioGroup ,FormControlLabel, Radio } from '@material-ui/core';
import './Student.css'
import ClipLoader from "react-spinners/ClipLoader";


class StudentFeedback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadPage:false,
            spinner: [true,'נא להמתין הדף נטען'],
            isLoad:false,
            user: props.location,
            error:false,
            loading: true,
            page:'menu',
            rule:"Student",
            date:'',
            isFeedbackError: false,
            form:{
                canUpdate : true,
                feedback: '',
            },
            searchTerm:"",
            searchResults:[],
            
            search: true,
            searchQuery: null,
            value1: [],
            options : [
                { key: 1, text: 'Choice 1', value: 1 },
                { key: 2, text: 'banana', value: 2 },
                { key: 3, text: 'kabuk', value: 3 },
            ]
        };

        this.handleChange1 = (e, { value }) => this.setState({ value })
        this.handleSearchChange1 = (e, { searchQuery }) => this.setState({ searchQuery })

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.hendleSerch = this.hendleSerch.bind(this)
        this.hendleRadioButton = this.hendleRadioButton.bind(this)




    }
    

    async sendDataToFirebase(form)
    {
        this.loadSpinner(true,"שולח נתוני משוב")
        var path = auth.currentUser.uid
        try{
            await db.collection("students").doc(path).collection("comes").doc(this.state.date).set({
                approved:true,
                form: form,
                date:this.state.date
            }).then(()=>{
                alert(" תודה, הטופס נשלח בהצלחה")
                window.location.reload(true);
            })

        }catch(error) {
            alert(error.message)
            this.loadSpinner(false)
        }


        this.loadSpinner(false)
    }

    getItem(item)
    {
        // console.log(item.item)
        this.setState({searchTerm:item.item});
    }
    hendleSerch(event)
    {
        // this.setState({searchTerm:event.target.value})
        // this.hendleRes()
        const results = this.people.filter(person =>
            person.toLowerCase().includes(event.target.value)
        );
        this.setState({searchResults:results,searchTerm:event.target.value});

    }
    hendleRadioButton(event)
    {
        var feeedbackMeeting=''
        var form = this.state.form
        if(form.feeedbackMeeting)
            feeedbackMeeting= form.feeedbackMeeting
        else
            feeedbackMeeting={}
        feeedbackMeeting[event.target.name] = event.target.value;
        form.feeedbackMeeting=feeedbackMeeting
        this.setState({form:form})
     }

    async handleChange(event)
    {
        var form ="";
        var name = event.target.name;
        var value = event.target.value;
        if(name === 'date' && event.target.value!=='' )
        {
            var test = await db.collection("students").doc(auth.currentUser.uid).collection("comes").doc(event.target.value).get()
            if(test.exists && test.data().form) {
                alert("מילאת משוב לתאריך הנוכחי נא לבחור תאריך אחר")
                form = this.state.form;
                this.setState({date:''})
            }
            else
            {
                this.setState({date:value})
            }
        }
        else
        {
            form = this.state.form
            form[name] = value;
            this.setState({form:form})
        }
    }

    handleSubmit(event)
    {

        if (this.state.form.feedback === '') {
            this.setState({isFeedbackError: true})
            return;
        } else {
            this.sendDataToFirebase(this.state.form)
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

        console.log('this.state RENDER',this.state)

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
                            //   css={override}
                                    size={120}
                                    color={"#123abc"}

                        />
                    </div>
                </div>
            }

            <div id="attendreport" className="sec-design" dir='rtl'>
                <h2>שלום {this.state.user.displayName} </h2>

                <div id="name-group" className="form-group">
                    <label id="insert-student" className="title-input" htmlFor="name">:בחר את תאריך המפגש </label>
                    <input type="date" className="form-control" id="insert-date" value={this.state.date} name="date"
                           onChange={this.handleChange}
                           required/>
                </div>

                <div id="box" className="chekbox">
                    <label id="checkbox" className="title-input" htmlFor="name">
                        באיזה מידה המפגש היום חידש לך / למדת דברים חדשים?
                    </label>
                    <br/>

                    <div>
                        <RadioGroup
                            aria-label="new"
                            name="q1"
                            // value={location}
                            onChange={this.hendleRadioButton}
                            row={true}
                        >
                            <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                              label="במידה מועטה מאוד"/>
                            <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                            <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                            <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                            <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                    </div>
                    <br/>
                    <label id="checkbox" className="title-input" htmlFor="name">
                        באיזה מידה אתה מרגיש שהמפגש יעזור לך בעתיד?
                    </label>
                    <br/>
                    <div>
                        <RadioGroup
                            aria-label="Location"
                            name="q2"
                            // value={location}
                            onChange={this.hendleRadioButton}
                            row={true}
                        >
                            <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                              label="במידה מועטה מאוד"/>
                            <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                            <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                            <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                            <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                    </div>
                    <br/>
                    <label id="checkbox" className="title-input" htmlFor="name">
                        באיזה מידה נושא המפגש היה רלוונטי עבורך?
                    </label>
                    <br/>
                    <div>
                        <RadioGroup
                            aria-label="Location"
                            name="q3"
                            // value={location}
                            onChange={this.hendleRadioButton}
                            row={true}

                        >
                            <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                              label="במידה מועטה מאוד"/>
                            <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                            <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                            <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                            <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                    </div>
                    <br/>
                    <label id="checkbox" className="title-input" htmlFor="name">
                        באיזה מידה לקחת חלק פעיל במפגש היום?
                    </label>
                    <br/>
                    <div>
                        <RadioGroup
                            aria-label="Location"
                            name="q4"
                            // value={location}
                            onChange={this.hendleRadioButton}
                            row={true}

                        >
                            <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                              label="במידה מועטה מאוד"/>
                            <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                            <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                            <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                            <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>

                        </RadioGroup>
                    </div>
                    <br/>

                    <div id="name-group" className="form-group">
                        <label id="feedback" className="title-input" htmlFor="name">מה את/ה לוקח/ת מהמפגש היום?
                        </label>
                        {/*<Grid item xs={12}>*/}
                        {/*    {*/}
                        {/*        <div>*/}

                        {/*            <textarea  dir="rtl" cols="70"  rows="5" onChange={this.handleChange}  required/>*/}


                        {/*        </div>*/}
                        {/*    }*/}
                        {/*</Grid>*/}
                        <input type="text" className="form-control" 
                        style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }

                        
                        name="feedback" id="Q4" placeholder="התשובה שלך"
                               minLength="10" onChange={this.handleChange} required/>
                    </div>
                </div>
                {/*<button id="confirm-form" className="btn btn-info"  onClick={this.handleSubmit}>הצגת נוכחות</button>*/}
                <button id="confirm-form" className="btn btn-info" onClick={this.handleSubmit}>דווח נוכחות ושלח משוב
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

                {/*<button id="go-back" className="btn btn-info" onClick={() => {*/}
                {/*        this.chooseLayout("menu")*/}
                {/*    }}>חזור*/}

                {/*    </button>*/}

            </div>
        </div>);
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


export  default  StudentFeedback;