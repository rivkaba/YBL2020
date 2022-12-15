import React from "react";
import {auth, db, getUser, signOut} from '../../../../firebase/firebase'
import { RadioGroup ,FormControlLabel, Radio } from '@material-ui/core';
import './Student.css'
import ClipLoader from "react-spinners/ClipLoader";


class StudentOpened extends React.Component {

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
            finalForm: {
                gender: '',
                age: '',
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                q6: '',
                q7: '',
                q8: '',
                q9: '',
                q10: '',
                q11: '',
                q2_1: '',
                q2_2: '',
                q2_3: '',
                q2_4: '',
                hopeTostudy: '',
                needTostudy: '',
            },            
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
        // this.hendleRadioButton = this.hendleRadioButton.bind(this)

    }



    getItem(item)
    {
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
    handleRadioButton = (event) =>
    {   
        console.log('event handleRadioButton',event.target.value)
 
        var nameValue = event.target.name;
        var value = event.target.value.toString();

        this.setState(prevState => ({
            finalForm: {
              ...prevState.finalForm,
              [nameValue]: value,
            }
          }));

     }

    async handleChange(event)
    {

        console.log('event handleChange',event.target.value)
 
        var nameValue = event.target.name;
        var value = event.target.value.toString();

        this.setState(prevState => ({
            finalForm: {
              ...prevState.finalForm,
              [nameValue]: value,
            }
        }));

    }

    sendDataToFirebase = async (collection) => {

        //Send data to firebase

        this.loadSpinner(true,"שולח נתוני משוב")
        var path = auth.currentUser.uid
        try{
            await db.collection("students").doc(path).collection('Opening questionnaire').doc('form').set({
                form: this.state.finalForm
            }).then(async()=>{
                alert(" תודה, הטופס נשלח בהצלחה")
                window.location.reload(true);
            })

        }catch(error) {
            alert(error.message)
            this.loadSpinner(false)
        }


        this.loadSpinner(false)

    }

    handleSubmit = (event) =>
    {
        var lack=false;
        var i=0;
        for (const key in this.state.finalForm) {
            i++;
            if (this.state.finalForm[key] == "") {
                lack=true;
                alert('חסרה תשובה מס '+ i)
            }
        } 
        if (lack===false)
                this.sendDataToFirebase()
            }

        

        // if (this.state.form.feedback === '') {
        //     this.setState({isFeedbackError: true})
        //     return;
        // } else {
        //     this.sendDataToFirebase(this.state.form)
        // }


    
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
        console.log('state:',this.state.finalForm)
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
  
               <h2> שאלון פתיחת שנה - תוכנית עתיד לנוער</h2>
חניכי וחניכות "מנהיגות עסקית צעירה" בתוכנית "עתיד לנוער" שלום רב,
זהו המפגש הראשון בתוכנית, ואנחנו מאחלים לכם בהצלחה! :)
בפניכם שאלון קצר הנוגע לתכנים השונים בהם תעסקו במהלך השנה. 
אנא קראו את השאלות וענו בהתאם לתחושותיכם. 
זכרו, השאלון אנונימי ואין תשובות נכונות ולא נכונות. אתם מתבקשים לענות את התשובה הכי נכונה עבורכם.
                 <br/>
                  <br/>
                <label id="checkbox" className="title-input" htmlFor="name">
                                 <b>  חלק א'</b>
             <h4>אנא סמן/י את התשובות הרלנווטיות לגביך/לגבייך</h4>
                    </label>
                    <br/>
                <div id="box" className="chekbox">

                    <label id="checkbox" className="title-input" htmlFor="name">
                   מגדר
                    </label>
                    <br/>
                    <div>
                        <RadioGroup
                            aria-label="new"
                            name="gender"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                            <FormControlLabel value="0" labelPlacement="end" control={<Radio/>} label="זכר"/>
                            <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="נקבה"/>
                        </RadioGroup>
                        <div id="name-group" className="form-group">
                            {/* <label id="feedback" className="title-input" htmlFor="name">Other </label> */}
                            <input type="text" className="form-control" 
                            style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                            name="gender" placeholder="אחר"
                            minLength="10" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <div>
                       <br/>

                       <label id="checkbox" className="title-input" htmlFor="name">
                   גיל
                    </label>
                    <br/>
                        <RadioGroup
                            aria-label="new"
                            name="age"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                            <FormControlLabel value="15" labelPlacement="end" control={<Radio/>} label="15"/>
                            <FormControlLabel value="16" labelPlacement="end" control={<Radio/>} label="16"/>
                            <FormControlLabel value="17" labelPlacement="end" control={<Radio/>} label="17"/>
                            <FormControlLabel value="18" labelPlacement="end" control={<Radio/>} label="18"/>
                            <FormControlLabel value="19" labelPlacement="end" control={<Radio/>} label="19"/>
                        </RadioGroup>
                        <div id="name-group" className="form-group">
                            {/* <label id="feedback" className="title-input" htmlFor="name">Other </label> */}
                            <input type="text" className="form-control" 
                            style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                            name="age" placeholder="אחר"
                            minLength="10" onChange={this.handleChange} required/>
                        </div>
                    </div>
                    <div>
                     <br/>
                             <br/>
                     <label id="checkbox" className="title-input" htmlFor="name">
                                 <b>  חלק ב'</b>
             <h4>אנא סמן/י באיזו מידה את/ה מסכים/ה עם הנאמר בכל אחד מהמשפטים הבאים?</h4>
                    </label>
                    <br/>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        יש לי מיומנויות שיעזרו לי להשתלב בשוק העבודה (עמידה בזמנים, יכולת הצגה עצמית, התמדה).   

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q1"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מרגיש/ה ביטחון לעמוד ולהציג מול קהל 

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q2"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                   <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מרגיש/ה בטוח להתמודד עם ראיון עבודה 

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q3"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                   <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני יודע/ת כיצד לכתוב קורות חיים באופן עצמאי    

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q4"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                  <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מאמין/ה שאצליח להשיג את העבודה שאני רוצה בעתיד  

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q5"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                               <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מאוד רוצה להשתלב בשוק העבודה בעתיד  

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q6"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                               <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מוכנ/ה להתאמץ כדי להשתלב בעבודה שתתאים לי   

                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q7"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                  <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        בעתיד, כשאמצע עבודה, יהיה לי חשוב להצליח בה ולהישאר בה לאורך זמן    
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q8"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                 <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני משקיע/ה מחשבה לגבי העתיד המקצועי שלי    
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q9"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                 <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        האם את/ה מתכוונ/ת להתגייס לצבא/ שירות לאומי?    
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q10"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="במידה מועטה מאוד"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="במידה מועטה"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="במידה בינונית"/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="במידה רבה"/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="במידה רבה מאוד"/>
                        </RadioGroup>
                                           <br/>
                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        אני מאמינ/ה שאצליח להשיג כל מטרה בחיים  
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q11"
                            // value={location}
                            onChange={this.handleRadioButton}
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
                    <div>
                            <br/>
                             <br/>
                     <label id="checkbox" className="title-input" htmlFor="name">
                                 <b> חלק ג'</b>
             <h4>עד כמה את/ה מרגיש/ה שאת/ה יודעת על כל אחד מהנושאים הבאים?</h4>
                    </label>

                        <label id="checkbox" className="title-input" htmlFor="name">
                        קורות חיים  
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q2_1"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="לא יודע/ת בכלל"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="יודעת מעט מאוד"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="יודע/ת מספיק "/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה  "/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה מאוד
"/>
                        </RadioGroup>
                                        <br/>

                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        ראיון עבודה 
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q2_2"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="לא יודע/ת בכלל"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="יודעת מעט מאוד"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="יודע/ת מספיק "/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה  "/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה מאוד
"/>
                        </RadioGroup>
                                        <br/>
                    </div>

                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        כתיבת תוכנית עסקית  
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q2_3"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="לא יודע/ת בכלל"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="יודעת מעט מאוד"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="יודע/ת מספיק "/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה  "/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה מאוד
"/>
                        </RadioGroup>
                                       <br/>
                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        תכנון גאנט עבודה    
                        </label>
                        <br/>
                        <RadioGroup
                            aria-label="new"
                            name="q2_4"
                            // value={location}
                            onChange={this.handleRadioButton}
                            row={true}
                        >
                                <FormControlLabel value="0" labelPlacement="end" control={<Radio/>}
                                                label="לא יודע/ת בכלל"/>
                                <FormControlLabel value="1" labelPlacement="end" control={<Radio/>} label="יודעת מעט מאוד"/>
                                <FormControlLabel value="2" labelPlacement="end" control={<Radio/>} label="יודע/ת מספיק "/>
                                <FormControlLabel value="3" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה  "/>
                                <FormControlLabel value="4" labelPlacement="end" control={<Radio/>} label="יודע/ת הרבה מאוד
"/>
                        </RadioGroup>
                    </div>
                    <div>
                    <br/>
                             <br/>
                     <label id="checkbox" className="title-input" htmlFor="name">
                                 <b>  חלק ד'</b>
                    </label>
                    <br/>
                  
                        <label id="checkbox" className="title-input" htmlFor="name">
                        מה את/ה מצפה ללמוד בתוכנית?
                        </label>
                        <div id="name-group" className="form-group">
                            {/* <label id="feedback" className="title-input" htmlFor="name">Other </label> */}
                            <input type="text" className="form-control" 
                            style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                            name="hopeTostudy" placeholder="תשובתך"
                            minLength="10" onChange={this.handleChange} required/>         
                        </div>
                         <br/>
                    </div>
                    <div>
                        <label id="checkbox" className="title-input" htmlFor="name">
                        מה את/ה מרגיש/ה שאת/ה צריך/ה ללמוד בתוכנית כדי להצליח להשתלב בעבודה שאת/ה רוצה ?
                        </label>
                        <div id="name-group" className="form-group">
                            {/* <label id="feedback" className="title-input" htmlFor="name">Other </label> */}
                            <input type="text" className="form-control" 
                            style={this.state.isFeedbackError === true ? { border: '2px solid red' } : { border: '' } }                        
                           name="needTostudy" placeholder="תשובתך "
                            minLength="10" onChange={this.handleChange} required/>
                                      
                        </div> 
                       <br/>
                        <br/>
                      <b>  תודה ובהצלחה!!</b>
                    </div>
        </div>

        <button id="confirm-form" className="btn btn-info" onClick={this.handleSubmit}>שלח שאלון
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


export  default  StudentOpened;
