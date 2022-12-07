import React, { Component } from "react";
import {getTeamFeedback, db, auth, getUser} from "../../../../firebase/firebase";
import Select from 'react-select'
import Grid from "@material-ui/core/Grid";
import $ from 'jquery'

import ClipLoader from "react-spinners/ClipLoader";

var options = []
class AttendReport extends Component {

    constructor(props) {
        super(props);


        this.state =
            {
                isLoaded:false,
                date:"",
                teamPath:"",
                loadPage:false,
                spinner: [true,'נא להמתין הדף נטען'],
                report:false
            }
            this.handleSubmit = this.handleSubmit.bind(this)
            this.handleChangeDate = this.handleChangeDate.bind(this)
    }

    loadSpinner(event,massage){
        var spinner = []
        spinner.push(event)
        spinner.push(massage)
        this.setState({spinner:spinner})
    }

    render() {
if(this.state.loadPage){
        return(
            <div id="instactorReport" className="sec-design">
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Select  placeholder={" בחר קבוצה "} options={options} onChange={(e)=>{
                                // console.log(e.label,e.value);
                                this.setState({teamPath:e.value})
                            }} required/>
                            
                              {/*<Route exact path="/"><label id="date" className="title-input">:הכנס את תאריך המפגש</label>
                            <input type="date" className="form-control" id="insert-date" name="date" onChange={this.handleChangeDate} required/>*/}
                        </Grid>
                        <Grid item xs={12}>
                            <div className="text-below-image">

                                <button onClick={(e)=>{
                                    this.handleSubmit(e)
                                    this.setState({report:!this.state.report})
                                }} >{this.state.report?"הסתר את כל הדוחות":"הצג את כל הדוחות נוכחות לקבוצה זו "}</button>

                            </div>
                        </Grid>
                        <Grid item xs={12}  hidden={!this.state.report}>
                            <div id="studentList" ></div>
                        </Grid>
                        <Grid item xs={12}>
                                <button id="feedback-button" className="btn btn-info" onClick={()=>{this.BackPage()}}>חזרה לתפריט</button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

        )
} else {
    // console.log(this.state.spinner)
    return (
        <div>
            {!this.state.spinner[0] ? "" :
                <div id='fr'>
                    {"טוען נתוני דף"}
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
        </div>)
}
    }
    async handleSubmit(event)
    {
        $("#studentList").replaceWith('<div id="studentList">')
        if( !this.state.teamPath) {
            //!this.state.date ||
            alert("נא לבחור קבוצה להצגה")
            return
        }
      //  var res= (await getTeamFeedbackByDate(this.state.teamPath.id,this.state.date)).studentsComes
        var res= await getTeamFeedback(this.state.teamPath.id)//.studentsComes 
        if(!res.empty)
        {
            res.forEach(async function(doc){
                var date=doc.id;
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
                 var lable=document.createElement("lable");
                    lable.innerHTML = date;
                    var br=document.createElement("br");
                    $('#studentList').append(lable);
                    $('#studentList').append(br);
               var studentsComes1 =doc.data().studentsComes;
                studentsComes1.forEach(name=>{
                    var lable=document.createElement("lable");
                    lable.innerHTML = name;
                    var br=document.createElement("br");
                    $('#studentList').append(lable);
                    $('#studentList').append(br);
                })
            })
        }
        // for (var name in res){
        //     var lable=document.createElement("lable");
        //     lable.innerHTML = name;
        //     var br=document.createElement("br");
        //     $('#studentList').append(lable);
        //     $('#studentList').append(br);
        // }
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
                    this.loadSpinner(true,"מיבא נתוני משתמש")
                    var nameTeams =  await db.collection("Teams").where("old", "==",false).get();
                    nameTeams.forEach(doc=>{
                        options.push({ value: doc.ref, label: doc.data().name })
                        options.sort((a, b) =>(a.label > b.label) ? 1 : -1)
                    })
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

    async handleChangeDate(event)
    {
        var name = event.target.name;
        var value = event.target.value;
        if(name === 'date')
        {
            this.setState({date:value,viewStudent:false});
            this.state.date=value
        }
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
    BackPage()
    {
        this.props.history.push({
            pathname: `/Manager/${this.state.user.uid}`,
            data: this.state.user // your data array of objects
        })
    }
}



export default AttendReport;
