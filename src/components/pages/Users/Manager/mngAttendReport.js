
import React, { Component } from "react";
import {getTeamFeedback, getTeamFeedbackByDate,getstudentSdidntCome,db, auth, getUser} from "../../../../firebase/firebase";
import Select from 'react-select'
import Grid from "@material-ui/core/Grid";
import $ from 'jquery'

import ClipLoader from "react-spinners/ClipLoader";

 //var options = []
// var optionsDate = []
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
                report:false,
                report1:false,
                optionDate:false,
                option: [],
                optionsDate: [],
                results: [],
                results2: []
            }
            this.handleSubmit = this.handleSubmit.bind(this)
            this.handleSubmitFeedbackByDate = this.handleSubmitFeedbackByDate.bind(this)
           // this.handleChangeDate = this.handleChangeDate.bind(this)
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
                            <Select  placeholder={" בחר קבוצה "} options={this.state.options} onChange={(e)=>{
                                this.setState({teamPath:e.value,teamName:e.label})
                            this.resetConfig()
                                this.setState({optionDate: false})
                                this.setState({optionsDate: []});
                            }} required/>
                            
                              {/*<Route exact path="/"><label id="date" className="title-input">:הכנס את תאריך המפגש</label>
                            <input type="date" className="form-control" id="insert-date" name="date" onChange={this.handleChangeDate} required/>*/}
                        </Grid>
                        <Grid item xs={12}>
                            <div className="text-below-image">
                                <button  onClick={()=>{
                                    this.GetDates()
                                    // this.setState({optionDate:!this.state.optionDate})
                                     this.setState({report1:!this.state.report1})
                                }} >{this.state.optionDate?"הסתר דוח":"הצג דוח נוחכות לקבוצה זו לפי תאריך "}</button>
                            </div>
                        </Grid>
                            {this.state.optionsDate.length == 0 ? 
                            <>
                                <Grid item xs={12} hidden={!this.state.optionDate}>
                                        <Select id = 'select'  
                                        placeholder={'בחר תאריך'} 
                                        value={'test'}  
                                        onChange={(e)=>{  
                                            // this.setState({viewStudent:false});
                                            // this.handleSubmitFeedbackByDate(e);
                                        }} required/>
                                        </Grid>     
                                </>
                                :
                                <>
                                <Grid item xs={12} hidden={!this.state.optionDate}>
                                        <Select id ='select'  
                                        placeholder={'בחר תאריך'} 
                                        options={this.state.optionsDate} 
                                        onChange={(e)=>{  
                                            this.setState({viewStudent:false});
                                            this.handleSubmitFeedbackByDate(e);
                                               }} required/>
                                        </Grid>
                                        {this.state.results.length !== 0 ? <>
                                      <b>  :החניכים שהיו במפגש</b>
                                        <Grid item xs={12}  hidden={!this.state.report1}>
                                            {
                                                this.state.results.map(function(result, i){
                                                    return <ul style={{ padding: "0" }}>
                                                        {<li style={{ listStyleType: "none" }}>{result}</li>}
                                                    </ul>
                                                })      
                                                                                    
                                            }

                                    {/* <div id="studentList1" ></div> */}
                                </Grid>    
                                </> : ""}
                                </>       
                        
                                    }
                                           {this.state.results2.length !== 0 ? <>
                                        <b>  : החניכים שלא היו במפגש</b>
                                        <Grid item xs={12}  hidden={!this.state.report1}>
                                            {
                                                this.state.results2.map(function(result, i){
                                                    return <ul style={{ padding: "0" }}>
                                                        {<li style={{ listStyleType: "none" }}>{result}</li>}
                                                    </ul>
                                                })      
                                                                                    
                                            }

                                    {/* <div id="studentList1" ></div> */}
                                </Grid>    
                                </> : ""}
                                      
                        
                                    

                        
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

    resetConfig = async() => {
        this.setState({optionsDate : []});
        // $("#studentList1").empty();
        this.setState({optionDate:false})
        // window.location.reload();

        // this.setState({date:'TEST!' })
    }


    async  GetDates()
    {
        if( !this.state.teamPath) {
            this.setState({optionDate:false})
            this.setState({optionsDate : []});
            alert("נא לבחור קבוצה להצגה")
            return
        } else {
            this.setState({optionDate:!this.state.optionDate})

          var dates = await db.collection("Teams").doc(this.state.teamPath.id).collection("Dates").get()
          dates.forEach(doc=>{
                // optionsDate.push({ value: doc.data(), label: doc.id })
                this.setState((prevState) => ({
                    optionsDate: [
                        ...prevState.optionsDate,
                        { value: doc.data(), label: doc.id }                    ]
                }));
          })
        }
    }








    async handleSubmit(event)
    {
        $("#studentList").replaceWith('<div id="studentList">')
        if( !this.state.teamPath) {
            alert("נא לבחור קבוצה להצגה")
            return
        }
        var res= await getTeamFeedback(this.state.teamPath.id)
        if(!res.empty)
        {
            res.forEach(async function(doc){
                var date=doc.id;
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
    }

    

    async componentDidMount() {
        var href =  window.location.href.split("/",5)
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
                   var newOptions = [];
                   
                    nameTeams.forEach(doc=>{
                        newOptions.push({ value: doc.ref, label: doc.data().name })
                        newOptions.sort((a, b) =>(a.label > b.label) ? 1 : -1)
                    })
                    this.setState({options: newOptions})
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
     async handleSubmitFeedbackByDate(event){

        $("#studentList1").replaceWith('<div id="studentList1">')
       var res= (await getTeamFeedbackByDate(this.state.teamPath.id, event.label)).studentsComes
        var res2=(await getstudentSdidntCome(this.state.teamName,res))
        console.log("teamName2",this.state.teamName)
       if(res.length != 0)
        { 
            this.setState({results: res })
            if(res2.length != 0){
                 this.setState({results2: res2 })
        }

        }
       
       
              /*  var lable=document.createElement("lable");
                    lable.innerHTML = "החניכים שלא היו במפגש";
                var  br=document.createElement("br");
                    $('#studentList1').append(lable);
                    $('#studentList1').append(br);
                res2.forEach(name=>{
                    lable=document.createElement("lable");
                    lable.innerHTML = name;
                    br=document.createElement("br");
                    $('#studentList1').append(lable);
                    $('#studentList1').append(br);
                })*/
     }
   /* async handleChangeDate(event)
    {
        var name = event.target.name;
        var value = event.target.value;
        if(name === 'date')
        {
            this.setState({date:value,viewStudent:false});
            this.state.date=value
        }
    }*/

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