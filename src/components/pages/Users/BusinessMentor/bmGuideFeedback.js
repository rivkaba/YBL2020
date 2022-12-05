import  React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import {auth, db, getPathData, getUser} from "../../../../firebase/firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { CSVLink } from "react-csv";



var csvData = [];


class bmGuideFeedback extends Component {

    constructor(props) {
        super(props);
        this.state =
            {
                user: props.location,
                isLoaded:false,
                show:false,
                loadPage:false,
                spinner: [true,'נא להמתין הדף נטען'],
                team: {},
                show: false
            }
    }




    async  GetTeams() {
        this.loadSpinner(true,"מיבא נתוני קבוצה")
        var from = this.GetDates(this.state.dateFrom)
        var to = this.GetDates(this.state.dateTo)
       // var team = (await db.collection("BusinessMentor").doc(auth.currentUser.uid).get()).data().team
       
       var teamName = (await db.collection("BusinessMentor").doc(auth.currentUser.uid).get()).data().teamName;
 
       /*   var team = await db.collection("Teams").where("name",'==',teamName).get()
       console. log(team. id, " => ", team. data())
       alert(teamName)*/
       ////
       var options = [];
       this.setState({options: options})
       var team = {};
       await db.collection("Teams").where("name", "==", teamName)
         .get()
         .then(function(querySnapshot) {
             console.log('querySnapshot', querySnapshot)
            querySnapshot.forEach(function(doc) {
            team['teamID'] = doc.id;
            team['teamName'] = teamName
           
          });
         })
         this.setState({team: team})

         var name = await db.collection("Teams").where("name", "==", teamName).get();
   
       ////
      // var doc1= await db.collection("Teams").doc(team.id).get()
     
     
       // this.setState({team:team,teamName:teamName})
         
        if(!this.state.dateFrom || !this.state.dateTo )
        {
            alert("נא למלא תאריך התחלה וסיום")
            this.loadSpinner(false,'')
            return
        }

       
      /*  var nameTeams = await db.collection("Teams")
            .orderBy('name','asc')
            .get()*/

            console.log('name',name)
            console.log('this.state.team.teamID',this.state.team.teamID)

        // console.log("in 1")
       var Teamcollection = async () => {
           // var dates = await db.collection("Teams").doc(team.id).collection("Dates")
           var dates = await db.collection("Teams").docs(this.state.team.teamID).collection("Dates")
                .where('date','>=',from)
                .where('date','<=',to)
                .get()

                console.log('dates',dates)

            if(!dates.empty)
            { 
                alert("bbbbb");
                var forms=[]
                console.log('DATES',dates)
                dates.forEach(async function(doc){
                    if(doc.data().reportGuide0)
                    {
                        var FormsGuide = await getPathData(doc.data().reportGuide.path)
                        forms.push(FormsGuide)
                    }
                })
              
                
                return [team,dates,forms]
            }

        }

        var teamCollectionResult = await Teamcollection();
       ///
       console.log('teamcollection', teamCollectionResult)

       
 /*       Promise(Teamcollection).then(res => {
            res.forEach(item=>{
                // console.log("in 3")
                if(item)
                    options.push({ value: item, label:  item[0].data().name})
                
            })
            this.setState({options:options})
            // console.log("in 4")
            this.loadSpinner(false,"")
        })*/
       ////

        

    }


    createCsvFile(forms,reportGuide)
    {
        csvData = [
            [
                "שם קבוצה",
                "שם המדריך",
                "תאריך המפגש",
                "נושא המפגש",
                "מספר הפעילות",
                "מה היה בפעילות",
                "עם איזה תחושה יצאתי מהפעילות",
                "עם אילו הצלחות נפגשתי בפעילות",
                "עם אילו דילמות נפגשתי בפעילות",
                "נקודות חשובות למפגש הבא",
                "באיזו מידה אתה מרגיש שהצלחת להעביר את נושא הפעילות",
                "שאלות ומחשבות לשיחת הדרכה הבאה",
            ],
        ];

        reportGuide.map(report=>{
            // console.log(reportGuide)
            csvData.push([
                report.form.team,
                report.form.name,
                report.form.date,
                report.form.q1,
                report.form.q2,
                report.form.q3,
                report.form.q4,
                report.form.q5,
                report.form.q6,
                report.form.q7,
                report.form.q8,
                report.form.q9,

            ],)
       return report
        })

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


    loadSpinner(event,massage){
        var spinner = []
        spinner.push(event)
        spinner.push(massage)
        this.setState({spinner:spinner})
    }

    render() {

        console.log('this.state',this.state)

        if(this.state.loadPage){
        return(
            <div>
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
                <div id="studentFeedback" className="feedback-design" dir='rtl'>
                    <div id="studentFeedback" className="form-design" name="student_form" method="POST">
                        <div id="name-group" className="form-group">

                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    <label id="insert-student" className="title-input" htmlFor="name">מתאריך </label>
                                    <input type="date" className="form-control"  name="date"
                                           onChange={(e)=>{
                                               this.setState({dateFrom:e.target.value,options:null,show:false,teamName:null})
                                           }}
                                           required/>
                                </Grid>
                                <Grid item xs={5}>
                                    <label id="insert-student" className="title-input" htmlFor="name">עד תאריך </label>
                                    <input type="date" className="form-control" id="insert-date" name="date"
                                           onChange={(e)=>{
                                               this.setState({dateTo:e.target.value,options:null,show:false,teamName:null})
                                           }}
                                           required/>
                                </Grid>
                                 <Grid item xs={2} hidden={!this.state.dateTo || !this.state.dateFrom}>
                                    <label id="insert-student" className="title-input" htmlFor="name"> &nbsp;</label>
                                    <button id="viewReport" className="btn btn-info" onClick={()=>{
                                        this.GetTeams()
                                    }}>מצא קבוצות<span
                                        className="fa fa-arrow-right"></span></button>
                                 </Grid>
                                    <Grid item xs={3}  hidden={!this.state.team.teamName}>
                                    <button id="viewReport" className="btn btn-info" onClick={()=>{
                                        this.setState({show:!this.state.show, forms:this.state.team.team[1].docs, reportGuide:this.state.team[2]})
                                        this.createCsvFile(this.state.team.team[1].docs, this.state.team.team[2])
                                    }}>{!this.state.show?("הצג דו\"ח מפגשים"):("הסתר דו\"ח מפגשים")}<span
                                        className="fa fa-arrow-right"></span></button>
                                </Grid>

                            </Grid>
                        </div>
                        {this.state.forms?(
                            <Grid  item xs={12} hidden={!this.state.show} >

                                    <CSVLink
                                        data={csvData}
                                        filename={this.state.dateFrom+"-"+this.state.dateTo+"_g_מדריכים.csv"}
                                        className="btn btn-primary"
                                        target="_blank"
                                    >
                                <button>
                                    הורדת כל דוחות הקבוצה בתאריכים הנבחרים
                                </button>
                                    </CSVLink>
                                {
                                    this.state.forms.map((Form,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.feedbacks(Form.data(),index)}
                                        </Grid >
                                    ))
                                }
                            </Grid >
                        ):(<div></div>)}
                        <button id="go-back" className="btn btn-info" onClick={()=>{this.BackPage()}}>חזור</button>
                    </div>
                </div>
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

    feedbacks(form,index)
    {
        // console.log(csvData)
        // console.log(form)
        if(index>=this.state.reportGuide.length)
        {
            return
        }
        // console.log(this.state.show)
        if(form && this.state.show) {
            // console.log(form)
            var reportGuide = this.state.reportGuide[index].form
            var date =form.date.toDate()
            var day = date.getDate()
            var month = date.getMonth()+1
            var year = date.getFullYear()
            // console.log(reportGuide)
            return (
                <div id="name-group" className="form-group" dir="rtl">
                    <div className="report" id="report">
                        <div>
                            <div dir="rtl">
                            <h4> שם המדריך:{form.nameGuide} </h4>
                            <h4> תאריך המפגש: {day+'/'+month+"/"+year}</h4>
                            <h4> נושא המפגש: {reportGuide.q1}</h4>
                                <div id="name-group">
                                    <h4>  <label id="Q2L" className="title-input"> מספר הפעילות:</label></h4>
                                    {reportGuide.q2?(reportGuide.q2):('לא נכתבה תשובה לשאלה זו')}
                                </div>
                                <br/>
                                <div id="name-group" >
                                    <h4><label id="Q3L" className="title-input"> מה היה בפעילות?</label></h4>
                                    {reportGuide.q3?(reportGuide.q3):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text" name="q3" id="q3i" onChange={this.handleChange}  required/>*/}
                                </div>
                                <br/>
                                <div id="name-group" >
                                    <h4> <label id="Q4L" className="title-input">עם איזה תחושה יצאתי מהפעילות?</label></h4>
                                    {reportGuide.q4?(reportGuide.q4):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text"  name="q4" id="q4i" onChange={this.handleChange} placeholder="Your Answer" required/>*/}
                                </div>
                                <br/>
                                <div id="name-group" >
                                    <h4> <label id="Q5L" className="title-input">עם אילו הצלחות נפגשתי בפעילות?</label></h4>
                                    {reportGuide.q5?(reportGuide.q5):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text"  name="q5" id="q5i" onChange={this.handleChange} placeholder="Your Answer" required/>*/}
                                </div>
                                <br/>
                                <div id="name-group" >
                                    <h4> <label id="Q6L" className="title-input">עם אילו דילמות נפגשתי בפעילות?</label></h4>
                                    {reportGuide.q6?(reportGuide.q6):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text" name="q6" id="q6i" onChange={this.handleChange} placeholder="Your Answer" required/>*/}
                                </div>
                                <br/>
                                <div id="name-group" >
                                    <h4> <label id="Q7L" className="title-input" htmlFor="name"> נקודות חשובות למפגש הבא:</label></h4>
                                    {reportGuide.q7?(reportGuide.q7):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text" name="q7" id="q7i" onChange={this.handleChange} placeholder="Your Answer" required/>*/}
                                </div>
                                <br/>
                                <h4><label id="insert-name" className="title-input"><h4>באיזו מידה אתה מרגיש שהצלחת להעביר את נושא הפעילות?</h4></label></h4>
                                {(reportGuide.q8 === "0")?('במידה מועטה מאוד'):
                                    (reportGuide.q8 === "1")?('במידה מועטה'):
                                        (reportGuide.q8 === "2")?('במידה בינונית'):
                                            (reportGuide.q8 === "3")?('במידה רבה'):
                                                (reportGuide.q8 === "4")?('במידה רבה מאוד'):('לא נכתבה תשובה לשאלה זו')
                                    }
                                <br/>
                                <div id="name-group" >
                                    <h4> <label id="insert-name" className="title-input" htmlFor="name">שאלות ומחשבות לשיחת הדרכה הבאה:</label></h4>
                                    {reportGuide.q9?(reportGuide.q9):('לא נכתבה תשובה לשאלה זו')}
                                    {/*<input type="text" name="q9" id="q9i" onChange={this.handleChange} placeholder="Your Answer" minLength="10" required/>*/}
                                </div>
                        </div>
                        <div id='posts' hidden={form.feedbackToStudents.length === 0}>
                            <u><h3>נכתב על כל חניך:</h3></u>
                            {
                                form.feedbackToStudents.length > 0 &&
                                form.feedbackToStudents.map((feedback,i) =>
                                    <h5 key={i} >{feedback}</h5>
                                )
                            }

                        </div>
                    </div>
                </div>
                </div>
            )
        }
        else
            return (<div></div>)
    }

    parser(date)
    {
        var year=''
        var month = ''
        var day = ''
        var j=0;
        for(var i =0; i<date.length; i++)
        {
            if(j===0 && date[i]!=='-')
            {
                year+=date[i]
            }
            else if(j===1 && date[i]!=='-')
            {
                month+=date[i]
            }
            else if(j===2 && date[i]!=='-')
            {
                day+=date[i]
            }
            else
                j++

        }
        year = parseInt(year)
        month=parseInt(month)
        day= parseInt(day)
        return {year,month,day}
    }

    GetDates(date)
    {
        // if(this.state.forms || this.state.show)
        //     return

        date = this.parser(date)
        var parsDate = new Date()
        parsDate.setTime(0)
        parsDate.setFullYear(date["year"],date["month"]-1,date["day"])

        return parsDate;
    }

    loadUser(page)
    {
        this.props.history.push({
            // pathname: `/${page}/${this.state.user.id}`,
            pathname: `/Temp${page}`,
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

    notfound()
    {
        this.props.history.push({
            pathname: `/404`,
            data: this.state.user // your data array of objects
        })
    }
}



export default bmGuideFeedback;







  