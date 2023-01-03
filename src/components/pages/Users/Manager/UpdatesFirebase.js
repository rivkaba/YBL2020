import React, { Component } from "react";
import {db, CreateNewTeam, auth, getUser} from "../../../../firebase/firebase";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
import {CSVLink} from "react-csv";
 
var form:[]

var oldTeam = []
var options = []
var guidesOptions = []
var BusinessMentorOptions = []
var studentsOptions = []
var emptyGuidesOptions = []
var emptyBusinessMentorOptions = []
var emptyStudentsOptions = []
var emptyTeamOptions = []
//var TeamOptions = []
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
                showTeam:false,
                showGuides:false,
                showBusinessMentor:false,
                showStudents:false,
                showTeamWithoutGuide:false,
                showGuideWithoutTeam:false,
                showStudentWithoutTeam:false,
                summary:false,
                opening:false,
                load:false,
                showQ:false,
                teams:[],
                sTeam:[],
                ssTeam:[],
                ss1Team:[],
                ssTeam1:[],
                sTeam1:[],
             //   form:[]
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
                        <Select  placeholder={" בחר קבוצה "} options={options} onChange={async(e)=>{
                            this.loadSpinner(true,"מיבא קבוצה")
                          await this.setState({teamPath:(e.value).path,teamName:e.label})
                           this.loadSpinner(false," ")
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
                                    await db.doc(this.state.teamPath).update({
                                            old: true
                                        }).then(function() {
                                   alert("הקבוצה הועברה בהצלחה!");
                                }).catch(function(error) {
                                    console.error("Error removing document: ", error);
                                });
                                window.location.reload(true);
                            }
                            else
                             alert("יש לבחור קבוצה")
                        }}>העבר לארכיון</button>
                    </Grid>
                    <Grid item xs={12}>
                        <button onClick={()=>{
                           // this.loadSpinner(true,"מיבא נתוני משתמשים")
                            this.setState({showTeam:!this.state.showTeam})
                        }}>{this.state.showTeam?'הסתר רשימת קבוצות':'הצג רשימת קבוצות'} </button>
                    </Grid>
                    <Grid item xs={6} hidden={!this.state.showTeam} >
                        <button onClick={async ()=>{  
                            oldTeam=[]
                             var nameTeams =  await db.collection("Teams").where("old", "==",true).get();
                             nameTeams.forEach(doc=>{
                                oldTeam.push({ value: doc.ref, label: doc.data().name })
                                oldTeam.sort((a, b) =>(a.label > b.label) ? 1 : -1)         
                         })
                                this.setState({teams:oldTeam})
                                this.setState({archive:true})
                            }}> ארכיון הקבוצות</button>
                    </Grid>
                     <Grid item xs={6} hidden={!this.state.showTeam}>
                                
                               <button onClick={async ()=>{
                                 this.setState({StudentTeam:true})
                                  this.setState({archive:false})
                                 this.setState({teams:options})
                               
                            }}>פרטי קבוצות קיימות</button>
                    </Grid>
                    <Grid item xs={8} hidden={(!this.state.archive &&!this.state.StudentTeam)||!this.state.showTeam}>
                     
                        <Select  placeholder={" בחר קבוצה "} options={this.state.teams} onChange={async(e)=>{
                            this.setState({teamPath:(e.value).path,teamName:e.label})
                            // this.setState({guideTeamPath,guideTeamName
                            var STeam1=[]
                            var SSTeam1=[]
                            var guide= await db.collection("guides").where('teamName','==',e.label).get();
                             guide.forEach(async guide => {SSTeam1.push(guide)})
                            var res1= await db.collection("students").where('teamName','==',e.label).get()
                            res1.forEach(async res => {
                                 STeam1.push({value: res, label: res.data().fname + ' ' + res.data().lname})
                                 SSTeam1.push(res);
                                  }) 
                             this.setState({sTeam1:STeam1})
                            console.log("sTeam",this.state.sTeam1);
                            this.setState({ssTeam1:SSTeam1})
                             console.log("ssTeam",this.state.ssTeam1);
                             
                        }} required/>
                    </Grid>
                    <Grid item xs={8} hidden={!this.state.teamPath||!this.state.showTeam}>
                                      
                            
                               <div> נמצאו: {this.state.sTeam1.length} חניכים
                                    <Select  placeholder={" מצא חניך "} options={this.state.sTeam1} onChange={(e)=>{
                                        // console.log(e.label,e.value);
                                  
                                        this.setState({ssTeam1:[e.value]})
                                         console.log("e.value",e.value.data())
                                    }} />
                                </div>
                            
                               {
                                    this.state.ssTeam1.map((user,index) => (
                                        <Grid  item xs={12}  key={index}>
                                            <hr/>
                                            {this.card(user.data(),index)}
                                        </Grid >
                                    ))
                               }
                      
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
                               // await this.getAllUsers('Teams')
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
                        <button onClick={()=>{
                            this.setState({showQ:!this.state.showQ})
                        }}>{this.state.showQ?'הסתר שאלון פתיחה וסיום חונך':'הצג שאלון פתיחה וסיום חונך'} </button>
                    </Grid>
                    <Grid item xs={6} hidden={!this.state.showQ} >
                        <button onClick={async ()=>{  
                            oldTeam=[]
                             var nameTeams =  await db.collection("Teams").where("old", "==",true).get();
                             nameTeams.forEach(doc=>{
                                oldTeam.push({ value: doc.ref, label: doc.data().name })
                                oldTeam.sort((a, b) =>(a.label > b.label) ? 1 : -1)         
                         })
                                this.setState({teams:oldTeam})
                                this.setState({archiveQ:true})
                            }}> מקבוצות ישנות</button>
                    </Grid>
                     <Grid item xs={6} hidden={!this.state.showQ}>
                                
                               <button onClick={async ()=>{
                                 this.setState({StudentTeamQ:true})
                                  this.setState({archiveQ:false})
                                 this.setState({teams:options})
                               
                            }}>מקבוצות קיימות</button>
                    </Grid>
                    <Grid item xs={8} hidden={(!this.state.archiveQ &&!this.state.StudentTeamQ)||!this.state.showQ}>
                     
                        <Select  placeholder={" בחר קבוצה "} options={this.state.teams} onChange={async(e)=>{
                            this.setState({teamPath:(e.value).path,teamName:e.label})
                          // this.student("Opening questionnaire");
                        }} required/>
                    </Grid>
                     <Grid item xs={8}  hidden={!this.state.teamPath||!this.state.showQ}>
                             <button onClick={async ()=>{                                                                 
                                  await this.student("Opening questionnaire"); 
                                   await this.setState({opening:true})
                                  await this.setState({summary:false})
                            }}>שאלון פתיחה</button>
                             <button onClick={async ()=>{ 
                                 
                            await  this.student("Summary questionnaire");
                            await this.setState({summary:true})
                                 await this.setState({opening:false})
                             }}>שאלון סיום</button>                                 

                            </Grid>
                    <Grid item xs={20} hidden={(!this.state.opening&&!this.state.summary)}>
                            
                               <div> נמצאו: {this.state.sTeam.length} חניכים
                                    <Select item xs={12} placeholder={" מצא חניך "} options={this.state.sTeam} onChange={(e)=>{
                                        // console.log(e.label,e.value);
                                        this.setState({ssTeam:[e.value[0].data()]})
                                        form=[e.value[1]];
                                    }} />
                                </div>
                            
                               {
                                    this.state.ssTeam.map((user,index) => (
                                        <Grid  item xs={20}  key={index}> 
                                            <hr/>
                                            {this.cardQuestionnaire(user,index)}
                                        </Grid >
                                    ))
                               }
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
                (user === 'teamEmpty' && this.state.TeamEmpty && this.state.TeamEmpty > 1)/* ||
                (user === 'oldTeam' && this.state.oldTeam && this.state.OldTeam > 1) ||
                (user === 'Teams' && this.state.Teams && this.state.Teams > 1)*/)
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
            /////oldTeam
        }  /*else if (user === 'oldTeam') {
            oldTeam = []
            temp = 'Teams'
        }*/
         else if (user === 'studentEmpty') {
            emptyStudentsOptions = []
            temp = 'students'
        } else if (user === 'teamEmpty') {
            emptyTeamOptions = []
            temp = 'Teams'
        } //else if (user === 'Teams') 
           // TeamOptions = []
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
                   /*  else if (user === 'oldTeam'&& res.data().old===true) {
                    allUsers.push(res)
                    oldTeam.push({value: res, label: res.name})
                    oldTeam.sort((a, b) =>(a.label > b.label) ? 1 : -1)
                    console.log(oldTeam)
                     } */
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
                                if (!found &&  tempTeam[newGuide].data().guide && tempTeam[newGuide].data().guide.id === res.id)
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
                } else if (user === 'teamEmpty' && !res.data().guide && res.data().old===false) {
                    allUsers.push(res)
                    emptyTeamOptions.push({value: res, label: res.data().name})
                    emptyTeamOptions.sort((a, b) =>(a.label > b.label) ? 1 : -1)

                } /*else if (user === 'Teams' && res.data().guide) {
                     allUsers.push(res)
                    TeamOptions.push({value: res, label: res.name})
                    TeamOptions.sort((a, b) =>(a.label > b.label) ? 1 : -1)
                }*/
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
       /* else if (user === 'oldTeam')
            this.setState({oldTeam: allUsers})
         else if (user === 'Teams') {
            this.setState({Teams: allUsers})
        }*/

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
                 <Grid item xs={8} hidden={!(user.type=='guides')}>
                     <h8> מדריך </h8>
                 </Grid>
                    <div>
                        <h4> שם: {user.fname+' '+ user.lname} </h4>
                        <h4> טלפון: {user.phone}</h4>
                        <h4> אימייל: {user.email}</h4>
                        <h4> ת.ז: {user.ID}</h4>
                        <h4> קבוצה: {user.teamName}</h4>
                        <Grid container spacing={2}>
                            <Grid item xs={8} hidden={this.state.archive}>
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
                                        if(user.type==='students' )
                                    {
                                        updateTeam = await db.collection('students').doc(user.uid)
                                        updateTeam.update({
                                            teamName:this.state.guideTeamName[0],
                                            team:this.state.guideTeamPath[0]
                                        })
                                        // console.log('in9')
                                        this.getAllUsers('students')
                                    }
                                    else
                                        if(user.type==='BusinessMentor' )
                                    {
                                        updateTeam = await db.collection('BusinessMentor').doc(user.uid)
                                        updateTeam.update({
                                            teamName:this.state.guideTeamName[0],
                                            team:this.state.guideTeamPath[0]
                                        })
                                        // console.log('in9')
                                        this.getAllUsers('BusinessMentor')
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

    cardQuestionnaire(user,index)
    {
        console.log("this.state.from",form)
         var form1=form[index]; 
        console.log("form",form1)
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
                          <Grid item xs={20}hidden={!this.state.opening }>
                          <b><label>שאלון פתיחה</label></b>
                           <h4></h4>
                          </Grid>
                           <Grid item xs={20}hidden={!this.state.summary}>
                          <b><label>שאלון סיום</label></b>
                           <h4></h4>
                          </Grid>
                            <Grid item xs={20}hidden={!this.state.opening && !this.state.summary }>
                                <div dir="rtl">    
                                 <b> <label>  חלק א'</label></b>
                                 <h4></h4>

                               <h8><label> מגדר:  {form1[0].gender}</label></h8>
                                <h8><label> גיל: {form1[0].age}</label> </h8>
                                <h4></h4>

                             <b>   חלק ב'</b>
                             <h4></h4>

<b>אנא סמן/י באיזו מידה את/ה מסכים/ה עם הנאמר בכל אחד מהמשפטים הבאים?</b>
   <h4></h4>
 <h8><label id="insert-name" className="title-input"><h8>יש לי מיומנויות שיעזרו לי להשתלב בשוק העבודה (עמידה בזמנים, יכולת הצגה עצמית, התמדה):
</h8></label></h8>
                                {(form1[0].q1 === "0")?('בכלל לא'):
                                    (form1[0].q1 === "1")?('במידה מועטה'):
                                        (form1[0].q1 === "2")?('במידה סבירה'):
                                            (form1[0].q1 === "3")?('במידה רבה'):
                                                (form1[0].q1 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>אני מרגיש/ה ביטחון לעמוד ולהציג מול קהל:
</h8></label></h8>
                                {(form1[0].q2 === "0")?('בכלל לא'):
                                    (form1[0].q2 === "1")?('במידה מועטה'):
                                        (form1[0].q2 === "2")?('במידה סבירה'):
                                            (form1[0].q2 === "3")?('במידה רבה'):
                                                (form1[0].q2 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>אני מרגיש/ה בטוח להתמודד עם ראיון עבודה:
</h8></label></h8>
                                {(form1[0].q3 === "0")?('בכלל לא'):
                                    (form1[0].q3 === "1")?('במידה מועטה'):
                                        (form1[0].q3 === "2")?('במידה סבירה'):
                                            (form1[0].q3 === "3")?('במידה רבה'):
                                                (form1[0].q3 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                   <h8><label id="insert-name" className="title-input"><h8>אני יודע/ת כיצד לכתוב קורות חיים באופן עצמאי:
</h8></label></h8>
                                {(form1[0].q4 === "0")?('בכלל לא'):
                                    (form1[0].q4 === "1")?('במידה מועטה'):
                                        (form1[0].q4 === "2")?('במידה סבירה'):
                                            (form1[0].q4 === "3")?('במידה רבה'):
                                                (form1[0].q4 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>אני מאמין/ה שאצליח להשיג את העבודה שאני רוצה בעתיד:
</h8></label></h8>
                                {(form1[0].q5 === "0")?('בכלל לא'):
                                    (form1[0].q5 === "1")?('במידה מועטה'):
                                        (form1[0].q5 === "2")?('במידה סבירה'):
                                            (form1[0].q5 === "3")?('במידה רבה'):
                                                (form1[0].q5 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                   <h8><label id="insert-name" className="title-input"><h8>אני מאוד רוצה להשתלב בשוק העבודה בעתיד:
</h8></label></h8>
                                {(form1[0].q6 === "0")?('בכלל לא'):
                                    (form1[0].q6 === "1")?('במידה מועטה'):
                                        (form1[0].q6 === "2")?('במידה סבירה'):
                                            (form1[0].q6 === "3")?('במידה רבה'):
                                                (form1[0].q6 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                   <h8><label id="insert-name" className="title-input"><h8>אני מוכנ/ה להתאמץ כדי להשתלב בעבודה שתתאים לי:
</h8></label></h8>
                                {(form1[0].q7 === "0")?('בכלל לא'):
                                    (form1[0].q7 === "1")?('במידה מועטה'):
                                        (form1[0].q7 === "2")?('במידה סבירה'):
                                            (form1[0].q7 === "3")?('במידה רבה'):
                                                (form1[0].q7 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                 <h8><label id="insert-name" className="title-input"><h8>בעתיד, כשאמצע עבודה, יהיה לי חשוב להצליח בה ולהישאר בה לאורך זמן:
</h8></label></h8>
                                {(form1[0].q8 === "0")?('בכלל לא'):
                                    (form1[0].q8 === "1")?('במידה מועטה'):
                                        (form1[0].q8 === "2")?('במידה סבירה'):
                                            (form1[0].q8 === "3")?('במידה רבה'):
                                                (form1[0].q8 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>אני משקיע/ה מחשבה לגבי העתיד המקצועי שלי:
</h8></label></h8>
                                {(form1[0].q9 === "0")?('בכלל לא'):
                                    (form1[0].q9 === "1")?('במידה מועטה'):
                                        (form1[0].q9 === "2")?('במידה סבירה'):
                                            (form1[0].q9 === "3")?('במידה רבה'):
                                                (form1[0].q9 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>האם את/ה מתכוונ/ת להתגייס לצבא/ שירות לאומי?:
</h8></label></h8>
                                {(form1[0].q10 === "0")?('בכלל לא'):
                                    (form1[0].q10 === "1")?('במידה מועטה'):
                                        (form1[0].q10 === "2")?('במידה סבירה'):
                                            (form1[0].q10 === "3")?('במידה רבה'):
                                                (form1[0].q10 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>אני מאמינ/ה שאצליח להשיג כל מטרה בחיים:
</h8></label></h8>
                                {(form1[0].q11 === "0")?('בכלל לא'):
                                    (form1[0].q11 === "1")?('במידה מועטה'):
                                        (form1[0].q11 === "2")?('במידה סבירה'):
                                            (form1[0].q11 === "3")?('במידה רבה'):
                                                (form1[0].q11 === "4")?('במידה רבה מאוד'):('')
                                }
                                 <h4></h4>
                               
                             <b>   חלק ג'</b>
                             <h4></h4>

<b>עד כמה את/ה מרגיש/ה שאת/ה יודעת על כל אחד מהנושאים הבאים? </b>
   <h4></h4>
 <h8><label id="insert-name" className="title-input"><h8>
קורות חיים:
</h8></label></h8>
                                {(form1[0].q2_1 === "0")?('לא יודע/ת בכלל'):
                                    (form1[0].q2_1 === "1")?('יודע/ת מעט מאוד'):
                                        (form1[0].q2_1 === "2")?('יודע/ת מספיק'):
                                            (form1[0].q2_1 === "3")?('יודע/ת הרבה'):
                                                (form1[0].q2_1 === "4")?('יודע/ת הרבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
ראיון עבודה:
</h8></label></h8>
                                {(form1[0].q2_2 === "0")?('לא יודע/ת בכלל'):
                                    (form1[0].q2_2 === "1")?('יודע/ת מעט מאוד'):
                                        (form1[0].q2_2 === "2")?('יודע/ת מספיק'):
                                            (form1[0].q2_2 === "3")?('יודע/ת הרבה'):
                                                (form1[0].q2_2 === "4")?('יודע/ת הרבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
כתיבת תוכנית עסקית:
</h8></label></h8>
                                {(form1[0].q2_3 === "0")?('לא יודע/ת בכלל'):
                                    (form1[0].q2_3 === "1")?('יודע/ת מעט מאוד'):
                                        (form1[0].q2_3 === "2")?('יודע/ת מספיק'):
                                            (form1[0].q2_3 === "3")?('יודע/ת הרבה'):
                                                (form1[0].q2_3 === "4")?('יודע/ת הרבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
תכנון גאנט עבודה:
</h8></label></h8>
                                {(form1[0].q2_4 === "0")?('לא יודע/ת בכלל'):
                                    (form1[0].q2_4 === "1")?('יודע/ת מעט מאוד'):
                                        (form1[0].q2_4 === "2")?('יודע/ת מספיק'):
                                            (form1[0].q2_4 === "3")?('יודע/ת הרבה'):
                                                (form1[0].q2_4 === "4")?('יודע/ת הרבה מאוד'):('')
                                }
                                 <h4></h4>

                            
                     
                                  <b> חלק ד'</b>
                             <h4></h4>
 <Grid item xs={20}hidden={!this.state.opening}>
                             <b>מה את/ה מצפה ללמוד בתוכנית?</b>
                             <h8><label>  {form1[0].hopeTostudy}</label></h8>
                                <h4></h4> 
                                <b>מה את/ה מרגיש/ה שאת/ה צריך/ה ללמוד בתוכנית כדי להצליח להשתלב בעבודה שאת/ה רוצה ?</b>
                             <h8><label>  {form1[0].needTostudy}</label></h8>
                             </Grid>
                             <Grid item xs={20}hidden={!this.state.summary}>
                            < b>לפניכם שאלות על תכנים שלמדתם במהלך השנה,  אנא סמן/י עד כמה למדת מכל אחד מהאירועים הבאים? </b>
   <h4></h4>
 <h8><label id="insert-name" className="title-input"><h8>
ימי שיא 	:
</h8></label></h8>
                                {(form1[0].q3_1 === "0")?('לא למדתי בכלל'):
                                    (form1[0].q3_1 === "1")?('למדתי מעט מאוד'):
                                        (form1[0].q3_1 === "2")?('למדתי מספיק'):
                                            (form1[0].q3_1 === "3")?('למדתי הרבהה'):
                                                (form1[0].q3_1 === "4")?('למדתי הרבה מאוד'):
                                                       (form1[0].q3_1 === "4")?('לא הגעתי לפעילות זו'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
ועדת היגוי 	:
</h8></label></h8>
                                {(form1[0].q3_2 === "0")?('לא למדתי בכלל'):
                                    (form1[0].q3_2 === "1")?('למדתי מעט מאוד'):
                                        (form1[0].q3_2 === "2")?('למדתי מספיק'):
                                            (form1[0].q3_2 === "3")?('למדתי הרבהה'):
                                                (form1[0].q3_2 === "4")?('למדתי הרבה מאוד'):
                                                       (form1[0].q3_2 === "4")?('לא הגעתי לפעילות זו'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
והפקת מיזם חברתי 	:
</h8></label></h8>
                                {(form1[0].q3_3 === "0")?('לא למדתי בכלל'):
                                    (form1[0].q3_3 === "1")?('למדתי מעט מאוד'):
                                        (form1[0].q3_3 === "2")?('למדתי מספיק'):
                                            (form1[0].q3_3 === "3")?('למדתי הרבהה'):
                                                (form1[0].q3_3 === "4")?('למדתי הרבה מאוד'):
                                                       (form1[0].q3_3 === "4")?('לא הגעתי לפעילות זו'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
                                הכשרה מקצועית 	:
</h8></label></h8>
                                {(form1[0].q3_4 === "0")?('לא למדתי בכלל'):
                                    (form1[0].q3_4 === "1")?('למדתי מעט מאוד'):
                                        (form1[0].q3_4 === "2")?('למדתי מספיק'):
                                            (form1[0].q3_4 === "3")?('למדתי הרבהה'):
                                                (form1[0].q3_4 === "4")?('למדתי הרבה מאוד'):
                                                       (form1[0].q3_4 === "4")?('לא הגעתי לפעילות זו'):('')
                                }
                                 <h4></h4>

                                   < b>עד כמה הרגשת שאת/ה למדת על עולם התעסוקה והעסקים מהדמויות הבאות? </b>
   <h4></h4>
 <h8><label id="insert-name" className="title-input"><h8>
מדריכ/ת הקבוצה	:
</h8></label></h8>
                                {(form1[0].q4_1 === "1")?('לא למדתי בכלל'):
                                    (form1[0].q4_1 === "2")?('למדתי מעט מאוד'):
                                        (form1[0].q4_1 === "3")?('למדתי מספיק'):
                                            (form1[0].q4_1 === "4")?('למדתי הרבהה'):
                                                (form1[0].q4_1 === "5")?('למדתי הרבה מאוד'):('')
                                }
                                 <h4></h4>
                                  <h8><label id="insert-name" className="title-input"><h8>
מנחה עסקי/ת	:
</h8></label></h8>
                                {(form1[0].q4_2 === "1")?('לא למדתי בכלל'):
                                    (form1[0].q4_2 === "2")?('למדתי מעט מאוד'):
                                        (form1[0].q4_2 === "3")?('למדתי מספיק'):
                                            (form1[0].q4_2 === "4")?('למדתי הרבהה'):
                                                (form1[0].q4_2 === "5")?('למדתי הרבה מאוד'):('')
                                }
                                 <h4></h4>

                                  <b> מה הייתה החוויה הכי משמעותית עבורך בתוכנית?</b>
                             <h8><label>  {form1[0].experience}</label></h8>
                              <h4></h4>
                              <b> מה את/ה לוקח/ת איתך מהתוכנית להמשך הדרך?</b>
                             <h8><label>  {form1[0].take}</label></h8>

                                                  </Grid>

                                </div>
                            </Grid>
                        </Grid>
            </div>
                            </div>

            </div>

        )
    }
   async student(type){                        
        this.loadSpinner(true,"מיבא סטודנטים");
        var options=[]
       // var forms=[]
        this.setState({options:options,show:false})
        var nameStudent = await db.collection("students").where('teamName','==',this.state.teamName).get()              
        var Studentcollection = nameStudent.docs.map( async function(doc) {
            var questionnaire = await db.collection("students").doc(doc.id).collection(type).doc("form").get()
                 
                console.log("type",type)
            if(questionnaire.exists)
            { var forms=[]
              /*  
                Opening.forEach(async function(doc){
                    if(doc.data().form)
                    {
                        forms.push(doc.data().form) 
                        console.log("forms",forms)
                    }
                })*/
                
                forms.push(questionnaire.data().form);
                console.log("forms",forms)
                
                return [doc,forms]
            } 
           
        })

        Promise.all(Studentcollection).then(res => {
            var sTeam=[];
            var ssTeam=[];
            var forms1=[];

            res.forEach(async item=>{
                // console.log("in 3")
                if(item){
                    sTeam.push({ value: item, label:  item[0].data().fname + ' ' + item[0].data().lname})
                    
                  ssTeam.push(item[0].data())
                  forms1.push(item[1])
                // this.setState({form:forms1})
                          form=forms1
                }                        
                      
            })
           sTeam.sort((a, b) =>(a.label > b.label) ? 1 : -1)
             
            this.setState({sTeam:sTeam,ssTeam:ssTeam})  
                                     //  form=forms1

           //  this.setState({form:forms1})
         
            this.loadSpinner(false,"")
        })
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



export default UpdatesFirebase;
