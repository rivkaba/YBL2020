import React, { Component } from "react";
import {db, CreateNewTeam, auth, getUser} from "../../../../firebase/firebase";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import {CSVLink} from "react-csv";


var options = []
var guidesOptions = []
var BusinessMentorOptions = []
var studentsOptions = []
var emptyGuidesOptions = []
var emptyBusinessMentorOptions = []
var emptyStudentsOptions = []
var emptyTeamOptions = []
var TeamOptions = []
var csvGuidesData = []
var csvStudentsData = []
var csvBusinessMentorData = []
class UpdatesFirebase extends Component {

    constructor(props) {
        super(props);

        this.state =
            {
                loadPage:false,
                spinner: [true,'נא להמתין הדף נטען'],
                isLoaded:false,
                date:"",
                newTeamName:'',
                teamPath:"",
                teamName:"",
                replaceTeamName:false,
                delete:false,
                showGuides:false,
                showBusinessMentor:false,
                showStudents:false,
                showTeamWithoutGuide:false,
                showGuideWithoutTeam:false,
                showStudentWithoutTeam:false,
            }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeDate = this.handleChangeDate.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    loadSpinner(event,massage){
        var spinner = []
        spinner.push(event)
        spinner.push(massage)
        this.setState({spinner:spinner})
    }

    async handleChange(event)
    {

        var value = event.target.value;
        if(value === '')
            this.setState({newTeamName:value,replaceTeamName:false})
        else
            this.setState({newTeamName:value})
    }
    async deleteTeam(){


    }


    createCsvFile(users,type)
    {
        if(type ==='guides')
        {
            csvGuidesData = [
                [
                    "שם פרטי",
                    "שם משפחה",
                    "ת.ז",
                    "טלפון",
                    "מייל",
                    "תפקיד",
                    "קבוצה",
                ],
            ];
            users.map(user=>{
                if(user)
                {
                csvGuidesData.push([
                    user.data().fname,
                    user.data().lname,
                    user.data().ID,
                    user.data().phone.substr(0,3)+"-"+user.data().phone.substr(3,user.data().phone.length),
                    user.data().email,
                    user.data().type==='testers'?'בודק':
                        user.data().type==='managers'?"מנהל":
                            user.data().type==='guides'?"מדריך":
                                user.data().type==='BusinessMentor'?"מנחה עסקי":
                                       user.data().type==='students'?"חניך":"",
                    user.data().teamName,

                ],)
                }
                return user
            })
        }
        ////////////
        else{
            if(type ==='BusinessMentor')
            {
                csvBusinessMentorData = [
                    [
                        "שם פרטי",
                        "שם משפחה",
                        "ת.ז",
                        "טלפון",
                        "מייל",
                        "תפקיד",
                        "קבוצה",
                    ],
                ];
                users.map(user=>{
                    if(user)
                    {
                    csvBusinessMentorData.push([
                        user.data().fname,
                        user.data().lname,
                        user.data().ID,
                        user.data().phone.substr(0,3)+"-"+user.data().phone.substr(3,user.data().phone.length),
                        user.data().email,
                        user.data().type==='testers'?'בודק':
                            user.data().type==='managers'?"מנהל":
                                user.data().type==='guides'?"מדריך":
                                    user.data().type==='BusinessMentor'?"מנחה עסקי":
                                           user.data().type==='students'?"חניך":"",
                        user.data().teamName,

                    ],)
                    }
                    return user
                })
            }
        
        //////////
            else
            {
                csvStudentsData = [
                    [
                        "שם פרטי",
                        "שם משפחה",
                        "ת.ז",
                        "טלפון",
                        "מייל",
                        "תפקיד",
                        "קבוצה",
                    ],
                ];
                users.map(user=>{
                    if(user) {
                        csvStudentsData.push([
                            user.data().fname,
                            user.data().lname,
                            user.data().ID,  
                            user.data().phone.substr(0, 2) + "-" + user.data().phone.substr(3, user.data().phone.length),
                            user.data().email,
                            user.data().type === 'testers' ? 'בודק' :
                                user.data().type === 'managers' ? "מנהל" :
                                    user.data().type === 'guides' ? "מדריך" :
                                          user.data().type==='BusinessMentor'?"מנחה עסקי":
                                                user.data().type === 'students' ? "חניך" : "",
                            user.data().teamName,

                        ],)
                    }
                    return user
                })

            }
        }
    }


    render() {
        if(this.state.loadPage)
        {
        return(
            <div id="instactorReport" className="sec-design" dir='rtl'>

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
                        <input type="text" name="team" placeholder="שם קבוצה חדשה" onChange={this.handleChange}/>
                    </Grid>
                    <Grid item xs={6} >
                        <button onClick={async ()=>{
                            var newTeam= this.state.newTeamName
                            await CreateNewTeam(newTeam)
                            window.location.reload(true)
                        }}>צור קבוצה חדשה</button>
                    </Grid>
                    <Grid item xs={6}>
                        <button onClick={()=>{
                            if(this.state.newTeamName && this.state.newTeamName.length > 0)
                                this.setState({replaceTeamName:true})
                            else
                                alert("שם הקבוצה החדשה לא יכול להיות ריק")
                        }}>החלף שם לקבוצה קיימת </button>
                    </Grid>
                    <Grid item xs={8} hidden={!this.state.replaceTeamName}>
                        <Select  placeholder={" בחר קבוצה להחלפת שם "} options={options} onChange={(e)=>{
                            // console.log(e.label,e.value);
                            this.setState({teamPath:e.value,teamName:e.label})
                        }} required/>
                    </Grid>
                    <Grid item xs={4} hidden={!this.state.replaceTeamName} >
                        <button onClick={async ()=>{

                            if(this.state.teamName !== this.state.newTeamName) {
                                await this.setState({replaceTeamName: false})
                                await this.state.teamPath.update({name:this.state.newTeamName})
                                alert('בוצע שינוי שם  קבוצה בהצלחה')
                                window.location.reload(true);

                            }
                            else
                            {
                                alert("שם זהה לא ניתן לשנות")
                            }
                        }}>אישור החלפה</button>
                    </Grid>
                    <Grid item xs={12}>
                        <button onClick={()=>{
                            this.setState({delete:!this.state.delete})
                            this.deleteTeam()
                        }}>{this.state.delete?'הסתר מחיקת קבוצה':'הצג מחיקת קבוצה'} </button>
                    </Grid>
                    <Grid item xs={8} hidden={!this.state.delete}>
                        <Select  placeholder={" בחר קבוצה "} options={options} onChange={(e)=>{
                            // console.log(e.label,e.value);
                            this.setState({teamPath:(e.value).path,teamName:e.label})
                        }} required/>
                    </Grid>
                    <Grid item xs={4} hidden={!this.state.delete} >
                        <button onClick={async ()=>{
                            // console.log(this.state.teamPath)
                            if(this.state.teamPath) {
                                await this.setState({delete: false})
                                var d = await db.doc(this.state.teamPath).get()
                                if(d.data().guide) {
                                    // console.log("team on guide remove")
                                    await d.data().guide.update({
                                        team: null,
                                        teamName: null
                                    })
                                }
                                var studs = await  db.collection("students").where('teamName','==',this.state.teamName).get()
                                studs.docs.forEach(async student=>{
                                    student.ref.update({
                                        teamName: null,
                                        team:null
                                    })
                                })

                                var guide = await  db.collection("guides").where('teamName','==',this.state.teamName).get()
                                guide.docs.forEach(async student=>{
                                    guide.ref.update({
                                        teamName: null,
                                        team:null
                                    })
                                })
                                var BusinessMentor = await  db.collection("BusinessMentor").where('teamName','==',this.state.teamName).get()
                                BusinessMentor.docs.forEach(async BusinessMentor=>{
                                    BusinessMentor.ref.update({
                                        teamName: null,
                                        team:null
                                    })
                                })

                                await db.doc(this.state.teamPath).delete().then(function() {
                                   alert("הקבוצה נמחקה בהצלחה!");
                                }).catch(function(error) {
                                    console.error("Error removing document: ", error);
                                });
                                window.location.reload(true);

                            }
                            else
                            {
                                // console.log("בחר קבוצה")
                            }
                        }}>מחק</button> 
                       
                       <button onClick={async ()=>{
                            if(this.state.teamPath) {
                            var res = await  db.collection("Teams").where('name','==',this.state.teamName).get()
                            res.docs.forEach(async team=>{
                                    team.ref.update({
                                        old: true   
                                    })
                                    alert("הקבוצה הועברה בהצלחה!");
                                })
                            }
                            else
                             alert("יש לבחור קבוצה")
                        }}>העבר לארכיון</button>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={()=>{
                                this.getAllUsers('guides')
                                this.setState({showGuides:!this.state.showGuides,guideTeamName:null,guideName:null})

                            }} >{this.state.showGuides?'הסתר רשימת מדריכים':'הצג רשימת מדריכים'}</button>
                            {
                                (this.state.showGuides && this.state.Guides) ? (
                                    <div>
                                        <Grid item xs={12}>
                                            נמצאו:{this.state.Guides.length} מדריכים
                                            <Select placeholder={" מצא מדריך "} options={guidesOptions}
                                                    onChange={(e) => {
                                                        // console.log(e.label, e.value);
                                                        this.setState({Guides: [e.value]})
                                                    }}/>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <CSVLink
                                                data={csvGuidesData}
                                                filename={"רשימת מדריכים.csv"}
                                                className="btn btn-primary"
                                                target="_blank"
                                            >
                                                <button>
                                                    הורדת פרטי קשר מדריכים
                                                </button>
                                            </CSVLink>
                                        </Grid>
                                    </div> ) : ('')
                            }
                            {
                                (!this.state.Guides || !this.state.showGuides)?'':
                                    this.state.Guides.map((Guide,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(Guide.data(),index)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>
                    
                     <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={()=>{
                                this.getAllUsers('BusinessMentor')
                                this.setState({showBusinessMentor:!this.state.showBusinessMentor,BusinessMentorTeamName:null,BusinessMentorName:null})

                            }} >{this.state.showBusinessMentor?'הסתר רשימת מנחים עסקיים':'הצג רשימת מנחים עסקיים'}</button>
                            {
                                (this.state.showBusinessMentor && this.state.BusinessMentor) ? (
                                    <div>
                                        <Grid item xs={12}>
                                            נמצאו:{this.state.BusinessMentor.length} מנחים עסקיים
                                            <Select placeholder={"מצא מנחה עסקי "} options={BusinessMentorOptions}
                                                    onChange={(e) => {
                                                        // console.log(e.label, e.value);
                                                        this.setState({BusinessMentor: [e.value]})
                                                    }}/>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <CSVLink
                                                data={csvBusinessMentorData}
                                                filename={"מנחים עסקיים.csv"}
                                                className="btn btn-primary"
                                                target="_blank"
                                                >
                                                <button>
                                                    הורדת פרטי קשר מנחים עסקיים
                                                </button>
                                            </CSVLink>
                                        </Grid>
                                    </div> ) : ('')
                            }
                            {
                                (!this.state.BusinessMentor || !this.state.showBusinessMentor)?'':
                                    this.state.BusinessMentor.map((BusinessMentor,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(BusinessMentor.data(),index)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>
                  
                    <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={()=>{
                                this.getAllUsers('students')
                                this.setState({showStudents:!this.state.showStudents,studentTeamName:null,studentName:null})

                            }} >{this.state.showStudents?'הסתר רשימת חניכים':'הצג רשימת חניכים'}</button>
                            {
                                (this.state.showStudents && this.state.Students) ? (
                                    <div>
                                        <Grid item xs={12}>
                                            נמצאו:{this.state.Students.length} חניכים
                                            <Select placeholder={" מצא חניך "} options={studentsOptions}
                                                    onChange={(e) => {
                                                        // console.log(e.label, e.value);
                                                        this.setState({Students: [e.value]})
                                                    }}/>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <CSVLink
                                                data={csvStudentsData}
                                                filename={"רשימת חניכים.csv"}
                                                className="btn btn-primary"
                                                target="_blank"
                                            >
                                                <button>
                                                    הורדת פרטי קשר חניכים
                                                </button>
                                            </CSVLink>
                                        </Grid>
                                    </div> ) : ('')
                            }
                            {
                                (!this.state.Students || !this.state.showStudents)?'':
                                    this.state.Students.map((Student,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(Student.data(),index)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>

                    <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={async ()=>{
                                await this.getAllUsers('studentEmpty')
                                await this.getAllUsers('Teams')
                                this.setState({showStudentWithoutTeam:!this.state.showStudentWithoutTeam})
                            }} >{this.state.showStudentWithoutTeam?'הסתר רשימת חניכים ללא קבוצה':'הצג רשימת חניכים ללא קבוצה'}</button>
                            {
                                (this.state.showStudentWithoutTeam && this.state.StudentEmpty )?(<div> נמצאו: {this.state.StudentEmpty.length} חניכים
                                    <Select  placeholder={" מצא חניך "} options={emptyStudentsOptions} onChange={(e)=>{
                                        // console.log(e.label,e.value);
                                        this.setState({StudentEmpty:[e.value]})
                                    }} />
                                </div>):('')
                            }
                            {
                                (!this.state.StudentEmpty || !this.state.showStudentWithoutTeam)?'':
                                    this.state.StudentEmpty.map((user,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(user.data(),index)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>
                    <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={async ()=>{
                                await this.getAllUsers('guidesEmpty')
                                await this.getAllUsers('teamEmpty')
                                this.setState({showGuideWithoutTeam:!this.state.showGuideWithoutTeam})
                            }} >{this.state.showGuideWithoutTeam?'הסתר רשימת מדריכים ללא קבוצה':'הצג רשימת מדריכים ללא קבוצה'}</button>
                            {
                                (this.state.showGuideWithoutTeam && this.state.GuidesEmpty )?(<div> נמצאו: {this.state.GuidesEmpty.length} מדריכים
                                    <Select  placeholder={" מצא מדריך "} options={emptyGuidesOptions} onChange={(e)=>{
                                        // console.log(e.label,e.value);
                                        this.setState({GuidesEmpty:[e.value]})
                                    }} />
                                </div>):('')
                            }
                            {
                                (!this.state.GuidesEmpty || !this.state.showGuideWithoutTeam)?'':
                                    this.state.GuidesEmpty.map((Guide,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(Guide.data(),index)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>
                    <Grid item xs={12}>
                        <div className="text-below-image">
                            <button onClick={async ()=>{
                                await this.getAllUsers('guidesEmpty')
                                await this.getAllUsers('teamEmpty')
                                this.setState({showTeamWithoutGuide:!this.state.showTeamWithoutGuide})
                            }} >{this.state.showTeamWithoutGuide?'הסתר רשימת קבוצות ללא מדריך':'הצג רשימת קבוצות ללא מדריך'}</button>
                            {
                                (this.state.showTeamWithoutGuide && this.state.TeamEmpty )?(<div> נמצאו: {this.state.TeamEmpty.length} קבוצות
                                    <Select  placeholder={" מצא קבוצה "} options={emptyTeamOptions} onChange={(e)=>{
                                        // console.log(e.label,e.value);
                                        this.setState({TeamEmpty:[e.value]})
                                    }} />
                                </div>):('')
                            }
                            {
                                (!this.state.TeamEmpty || !this.state.showTeamWithoutGuide)?'':
                                    this.state.TeamEmpty.map((Team,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.teamCard(Team)}
                                        </Grid >
                                    ))


                            }
                        </div>

                    </Grid>





                    <Grid item xs={12}>
                        <button id="feedback-button" className="btn btn-info" onClick={()=>{this.BackPage()}}>חזרה לתפריט</button>
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


    BackPage()
    {
        this.props.history.push({
            pathname: `/Manager/${this.state.user.uid}`,
            data: this.state.user // your data array of objects
        })
    }

    async getAllUsers(user,reload) {
        this.loadSpinner(true,"מיבא נתוני משתמשים")

            if (!reload && (
                (user === 'guides' && this.state.Guides && this.state.Guides > 1) ||
                (user === 'BusinessMentor' && this.state.BusinessMentor && this.state.BusinessMentor > 1) ||
                (user === 'students' && this.state.Students && this.state.Students > 1) ||
                (user === 'guidesEmpty' && this.state.GuidesEmpty && this.state.GuidesEmpty > 1) ||
                (user === 'BusinessMentorEmpty' && this.state.BusinessMentorEmpty && this.state.BusinessMentorEmpty > 1) ||
                (user === 'studentEmpty' && this.state.StudentEmpty && this.state.StudentEmpty > 1) ||
                (user === 'teamEmpty' && this.state.TeamEmpty && this.state.TeamEmpty > 1) ||
                (user === 'Teams' && this.state.Teams && this.state.Teams > 1))
            ) {
                this.loadSpinner(false, "")
                return
        }
        var tempTeam=[]
        // console.log(user)
        var temp = user
        if (user === 'guides')
            guidesOptions = []
        else if (user === 'guidesEmpty') {
            emptyGuidesOptions = []
            temp = 'guides'
            // console.log("in1")
            tempTeam = await db.collection("Teams").get();
            tempTeam = tempTeam.docs
            //////////
        }else if (user === 'BusinessMentor')
            BusinessMentorOptions = []
        else if (user === 'BusinessMentorEmpty') {
            emptyBusinessMentorOptions = []
            temp = 'BusinessMentor'
            /////
        } else if (user === 'studentEmpty') {
            emptyStudentsOptions = []
            temp = 'students'
        } else if (user === 'teamEmpty') {
            emptyTeamOptions = []
            temp = 'Teams'
        } else if (user === 'Teams') 
            TeamOptions = []
          else if (user === 'students')
            studentsOptions = []
        var allUsers = []
        await db.collection(temp).get().then(res => {
            res.forEach( res => {
                if (res.data().uid) {
                    if (user === 'students') {
                        allUsers.push(res)
                        studentsOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                    }
                      ////////////
                      else if (user === 'BusinessMentor') {
                        allUsers.push(res)
                        BusinessMentorOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                    }////////////
                      else if (user === 'guides') {
                        allUsers.push(res)
                        guidesOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})

                    } else if (user === 'guidesEmpty' /*&& !res.data().team*/) {
                        if(!res.data().team )//////////////////////////////////////////////////////////
                        {
                            allUsers.push(res)
                            emptyGuidesOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                        }
                        else {
                            var found = false
                            for (var newGuide in tempTeam) {
                                if (!found &&  [newGuide].data().guide && tempTeam[newGuide].data().guide.id === res.id)
                                    found = true
                            }
                            if (!found) {
                                allUsers.push(res)
                                emptyGuidesOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                            }
                        }

                    } else if (user === 'studentEmpty' && !res.data().teamName) {
                        allUsers.push(res)
                        emptyStudentsOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                    }
                    /////
                     else if (user === 'BusinessMentorEmpty' && !res.data().teamName) {
                        allUsers.push(res)
                        emptyBusinessMentorOptions.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                     }
                     /////////
                } else if (user === 'teamEmpty' && !res.data().guide) {
                    allUsers.push(res)
                    emptyTeamOptions.push({value: res, label: res.name})
                    emptyTeamOptions.sort((a, b) =>(a.label > b.label) ? 1 : -1)


                } else if (user === 'Teams' && res.data().guide) {
                    allUsers.push(res)
                    TeamOptions.push({value: res, label: res.name})
                    TeamOptions.sort((a, b) =>(a.label > b.label) ? 1 : -1)
                }
            })
        })
        if (user === 'guides') {
            this.setState({Guides: allUsers})
            this.createCsvFile(allUsers,'guides')
        }
        ////
        else if (user === 'BusinessMentor') {
            this.setState({BusinessMentor: allUsers})
            this.createCsvFile(allUsers,'BusinessMentor')
        }
        ///
        else if (user === 'students') {
            this.setState({Students: allUsers})
            this.createCsvFile(allUsers,'students')
        }
        else if (user === 'guidesEmpty')
            this.setState({GuidesEmpty: allUsers})
            ////
        else if (user === 'BusinessMentorEmpty')
            this.setState({BusinessMentorEmpty: allUsers})
            /////
        else if (user === 'studentEmpty')
            this.setState({StudentEmpty: allUsers})
        else if (user === 'teamEmpty')
            this.setState({TeamEmpty: allUsers})
        else if (user === 'Teams') {
            this.setState({Teams: allUsers})
        }

        this.loadSpinner(false,"")
        // console.log(allUsers)
    }


    async handleSubmit(event)
    {
        this.loadSpinner(true,"מיבא קבוצות")
        // console.log(this.state.teamPath)
        if(!this.state.date) {
            this.loadSpinner(false,"")
            return;
        }
        // console.log("in");
        var team = await db.collection("Teams").doc(this.state.teamPath).get();
        // console.log(team)
        this.loadSpinner(false,"")
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
                    this.loadSpinner(true,"מיבא קבוצות")
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

    teamCard(team)
    {
        var TeamRef = team;
        team = team.data()

        return(
            <div id="name-group" className="form-group" dir="rtl">
                <div className="report" id="report">
                    <div>
                        <h4> שם קבוצה: {team.name} </h4>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Select  placeholder={" שיבוץ מדריך "} options={emptyGuidesOptions} onChange={(e)=>{
                                    // console.log(e.label,e.value);
                                    this.setState({emtpyGuideTeamPath:e.value,emtpyguideTeamName:e.label,TempTeamName:team.name })
                                }} />
                            </Grid>
                            <Grid item xs={4}>
                                <button hidden={!this.state.emtpyGuideTeamPath || this.state.TempTeamName!==team.name} onClick={async ()=>{
                                    this.loadSpinner(true,"מעדכן נתונים")
                                    await db.collection("Teams").doc(TeamRef.id).set({
                                        guide:this.state.emtpyGuideTeamPath.ref
                                    }, { merge: true })
                                    await  db.collection("guides").doc(this.state.emtpyGuideTeamPath.id).set({
                                        team:TeamRef.ref,
                                        teamName:team.name
                                    }, { merge: true })
                                    this.getAllUsers("teamEmpty")
                                    this.loadSpinner(false,"")
                                    alert("המדריך נוסף בהצלחה")
                                }}>שיבוץ</button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }

    card(user,index)
    {
        return(
            <div id="name-group" className="form-group" dir="rtl">
                <div className="report" id="report">
                    <div>

                        <h4> שם: {user.fname+' '+ user.lname} </h4>
                        <h4> טלפון: {user.phone}</h4>
                        <h4> אימייל: {user.email}</h4>
                        <h4> ת.ז: {user.ID}</h4>
                        <h4> קבוצה: {user.teamName}</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Select  placeholder={" החלף קבוצה "} options={options} onChange={(e)=>{
                                    // console.log(e.label,e.value);
                                    user.optionss = e.label
                                    var teamPath = this.state.guideTeamPath
                                    var teamName = this.state.guideTeamName
                                    if(teamPath && teamName) {
                                        if (index < teamPath.length) {
                                            teamPath[index] = e.value
                                            teamName[index] = e.label
                                        }
                                        else
                                        {
                                            teamPath.push(e.value)
                                            teamName.push(e.label)
                                        }
                                    }
                                    else
                                    {
                                        teamPath = [e.value]
                                        teamName = [e.label]

                                    }
                                    this.setState({guideTeamPath:teamPath,guideTeamName:teamName,userID:user.ID})
                                 
                                }} />
                            </Grid>
                            <Grid item xs={4}>
                                <button hidden={!this.state["guideTeamName"] || user.ID !== this.state.userID } onClick={async ()=>{
                                    this.loadSpinner(true,"מעדכן נתונים")
                                    // console.log('in1')
                                    if(user.type==='guides' || user.type==='testers') {
                                        // console.log('in2')
                                        // console.log(user.uid)

                                        if(this.state["guideTeamPath"]) {
                                            try {
                                                var updateTeam;

                                                var oldGuide = await db.collection('Teams').doc(this.state.guideTeamPath[index].id).get()
                                                // console.log('in5')
                                                // console.log(oldGuide.data())

                                                await db.doc((oldGuide.data().guide).path).update({
                                                    teamName: null,
                                                    team: null
                                                })

                                                // console.log('in6')

                                            } catch (e) {
                                                console.log('לקבוצה לא היה מדריך לפני')
                                                // console.log(e)
                                            }
                                            try {
                                                await db.collection('Teams').doc(user.team.id).update({
                                                    guide: null
                                                })
                                            } catch {
                                                console.log("למדריך לא הייתה קבוצה לפני")
                                            }
                                        }
                                        updateTeam = await db.collection('guides').doc(user.uid)
                                        await updateTeam.update({
                                            teamName:this.state["guideTeamName"][0],
                                            team:this.state["guideTeamPath"][0]
                                        })


                                        await db.collection('Teams').doc(this.state["guideTeamPath"][0].id).update({
                                            guide: updateTeam
                                        })
                                        this.getAllUsers('guides')
                                    }
                                    else
                                    {
                                        // console.log('in8')
                                        // console.log(user.uid)
                                        updateTeam = await db.collection('students').doc(user.uid)
                                        updateTeam.update({
                                            teamName:this.state["guideTeamName"],
                                            team:this.state["guideTeamPath"]
                                        })
                                        // console.log('in9')
                                        this.getAllUsers('students')
                                    }
                                    this.loadSpinner(false,'')

                                    if(this.state.showGuides)
                                        this.getAllUsers("guides")
                                        /////
                                    if(this.state.showBusinessMentor)
                                        this.getAllUsers("BusinessMentor")
                                        /////
                                    if(this.state.showStudents)
                                        this.getAllUsers("students")
                                    if(this.state.showGuideWithoutTeam)
                                        this.getAllUsers("guidesEmpty")
                                    if(this.state.showStudentWithoutTeam)
                                        this.getAllUsers("StudentEmpty")
                                    alert('הוחלפה קבוצה')
                                }}>החלף</button>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>

        )
    }


    // attendReport() {
    //
    //     return(
    //         <div id="instactorReport" className="sec-design" dir='rtl'>
    //             <Grid container spacing={2}>
    //                 <Grid item xs={12}>
    //                     <input type="text" name="team" placeholder="שם קבוצה חדשה" onChange={this.handleChange}/>
    //                 </Grid>
    //                 <Grid item xs={6} >
    //                     <button onClick={()=>{CreateNewTeam(this.state.teamName)}}>צור קבוצה חדשה</button>
    //                 </Grid>
    //                 <Grid item xs={6}>
    //                     <button onClick={()=>{
    //                     if(this.state.teamName && this.state.teamName.length > 0)
    //                         this.setState({replaceTeamName:true})
    //                     else
    //                         alert("שם הקבוצה החדשה לא יכול להיות ריק")
    //                     }}>החלף שם לקבוצה קיימת </button>
    //                 </Grid>
    //                 <Grid item xs={8} hidden={!this.state.replaceTeamName}>
    //                 <Select  placeholder={" בחר קבוצה להחלפת שם "} options={options} onChange={(e)=>{
    //                         console.log(e.label,e.value);
    //                         this.setState({teamPath:e.value})
    //                     }} required/>
    //
    //                 </Grid>
    //                 <Grid item xs={4} hidden={!this.state.replaceTeamName} >
    //                     <button onClick={()=>{
    //                         console.log("בוצעה החלפה")
    //                         this.setState({replaceTeamName:false})
    //                     }}>אישור החלפה</button>
    //                 </Grid>
    //                     <Grid item xs={12}>
    //                         <div className="text-below-image">
    //
    //                             <button onClick={this.handleSubmit} >רשימת מדריכים</button>
    //                             <div></div>
    //                             <button id="feedback-button" className="btn btn-info" onClick={()=>{BackPage(this.props,this.state.user)}}>חזרה לתפריט</button>
    //                         </div>
    //
    //                     </Grid>
    //             </Grid>
    //         </div>
    //
    //     )
    // }


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



export default UpdatesFirebase;
