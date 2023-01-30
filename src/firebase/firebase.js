import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const firebaseConfig = {
    
    apiKey: "AIzaSyC5lZ0pGbNOQ7m7BsIssvOXQoog8N_SM1c",
    authDomain: "finalybl.firebaseapp.com",
    databaseURL: "https://finalybl.firebaseio.com",
    projectId: "finalybl",
    storageBucket: "finalybl.appspot.com",
    messagingSenderId: "427494885685",
    appId: "1:427494885685:web:9b536c1f2322e03052a47c",
    measurementId: "G-3WSTZQY0QK"
};

firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;

export async function CreateNewUser(email,phone) {
    var res = await auth.createUserWithEmailAndPassword(email,phone)
    return res;
}

export async function RegisterUser(uid,user) {
    uid.updateProfile({displayName:user.fname+" "+ user.lname})
    await db.collection("waitforapproval").doc(uid.uid).set(user);
    return;
}
export async function DeleteUser(uid) {

    await db.collection("waitforapproval").doc(uid).delete();
    return;
}
  

export async function CreateUser(user) {
    user.approve = true;
    if(user.type==="testers") {
        await db.collection("students").doc(user.uid).set(user)
        await db.collection("guides").doc(user.uid).set(user)
        await db.collection("managers").doc(user.uid).set(user)
        await db.collection("BusinessMentor").doc(user.uid).set(user)
    }
    else{    
        if(user.type==="guides") {
            var team=await db.collection('Teams').doc(user.team.id);
                team.set({
                    name: user.teamName,
                    guide: db.doc('guides/'+user.uid),
                    old:false
                })
        }
    
    else{    
        if(user.type==="BusinessMentor") {
            var team=await db.collection('Teams').doc(user.team.id);
                team.update({
                    BusinessMentor: db.doc('BusinessMentor/'+user.uid)
        })
        }    
    }
   }
   await  db.collection(user.type).doc(user.uid).set(user)
    await DeleteUser(user.uid)
    console.log("done the user is ready")
    return true;
}

export async function CreateNewTeam(team) {
    await  db.collection("Teams").doc().set({name:team,old:false}).then(()=>{
        alert("הקבוצה נוספה בהצלחה")
    return true;
    }
    ).catch((e)=>{
        alert("משהו השתבש הקבוצה לא נוספה ")
        return false;
    })

}
export async function checkUser() {
   const user =await auth.onAuthStateChanged();
   return user
}

export async function signOut() {
   await auth.signOut();
    return
}
//Guide
export async function getGuide(uid) {
    var guide = await db.collection("guides").doc(uid);
    // console.log(guide);
    return guide;
}

export async function getGuideData(uid) {
    var guideData = await (await db.collection("guides").doc(uid).get()).data();
    // console.log(guideData);
    return guideData;
}

export async function getGuideFormByDate(uid, date) {
    var guideData = await (await db.collection("guides").doc(uid).collection("comes").doc(date).get()).data();
    // console.log(guideData);
    return guideData;
}

export async function getPathData(path) {
    var guideData =await (await db.doc(path).get()).data();
    // console.log(guideData);
    return guideData;
}

export async function getGuideForms(uid) {
    var forms = [];
    var guideData = await db.collection("guides").doc(uid).collection("comes").get();
    // console.log(guideData.docs[0].data());
    guideData.docs.forEach(doc=>{
        forms.push(doc.data());
    })
    // console.log(forms);
    return forms;
}
///end guides
//BusinessMentor
export async function getBusinessMentor(uid) {
    var BusinessMentor = await db.collection("BusinessMentor").doc(uid);
    return BusinessMentor;
}

export async function getBusinessMentoreData(uid) {
    var BusinessMentorData = await (await db.collection("BusinessMentor").doc(uid).get()).data();
    return BusinessMentorData;
}

/*export async function getBusinessMentorFormByDate(uid, date) {
    var BusinessMentorData = await (await db.collection("BusinessMentor").doc(uid).collection("comes").doc(date).get()).data();
    return BusinessMentorData;
}


export async function getBusinessMentorForms(uid) {
    var forms = [];
    var BusinessMentorData = await db.collection("BusinessMentor").doc(uid).collection("comes").get();
    BusinessMentorData.docs.forEach(doc=>{
        forms.push(doc.data());
    })
    return forms;
}*/
///end BusinessMentor
//Student
export async function getStudent(uid) {
    var student = await db.collection("students").doc(uid);
    // console.log(student);
    return student;
}

export async function getStudentData(uid) {
    // console.log(uid)
    var studentData = await (await db.collection("students").doc(uid).get()).data();
    // console.log(studentData);
    return studentData;
}


export async function getStudentFormByDate(uid, date) {
    var studentFormByDate = await (await db.collection("students").doc(uid).collection("comes").doc(date).get()).data();
    // console.log(studentFormByDate);
    return studentFormByDate;
}

export async function getStudentForms(uid) {
    var forms = [];
    var studentData = await db.collection("students").doc(uid).collection("comes").get();
    // console.log(studentData.docs[0].data());
    studentData.docs.forEach(doc=>{
        forms.push(doc.data());
    })
    // console.log(forms);
    return forms;
}


//////end Student
export async function getUser(user)
{
    var testers = await db.collection('testers').doc(user.uid).get()
    var guides = await db.collection('guides').doc(user.uid).get()
    var BusinessMentor = await db.collection('BusinessMentor').doc(user.uid).get()
    var students = await db.collection('students').doc(user.uid).get()
    var managers = await db.collection('managers').doc(user.uid).get()
    var wait = await db.collection('waitforapproval').doc(user.uid).get()

    // console.log(user)
    // console.log(testers.data())
    if(wait.exists)
        return 'wait'
    else if(testers.exists)
        return 'Tester'
    else if(managers.exists)
        return 'Manager'
    else if(guides.exists)
        return 'Guide'
    else if(BusinessMentor.exists)
        return 'BusinessMentor'
    else if(students.exists)
        return 'Student'
    else
        return null
}


export async function getManager(uid) {
    var manager = await db.collection("managers").doc(uid);
    // console.log(manager);
    return manager;
}

export async function getManagerData(uid) {
    var managerData = await (await db.collection("managers").doc(uid).get()).data();
    // console.log(managerData);
    return managerData;
}
export async function getTeamFeedbackByDate(teamPath,date) {
    var team = await db.collection("Teams").doc(teamPath).collection("Dates").doc(date).get();
    console.log(teamPath);
    if(team === undefined)
    {

        alert("לא נמצא מדריך לקבוצה")
    }
    console.log(team);
    var teamFeedback=team.data()
    console.log(teamFeedback);
    return teamFeedback;
}
export async function getTeamFeedback(teamPath) {
    var teamFeedback = await db.collection("Teams").doc(teamPath).collection("Dates").get();
    if(teamFeedback === undefined)
    {
        ////// BusinessMentor  alert("לא נמצא מדריך עסקי לקבוצה")
        alert("לא נמצא מדריך לקבוצה")
    } 
    return teamFeedback;
}
export async function getstudentSdidntCome(teamName,studentsComes){
    var studentSdidntCome=[]
    var students= await db.collection("students")
       .where('teamName','==',teamName)
       //.where('fname'+'lname', 'not-in', studentsComes)
       .get();
       students.forEach(result=> {
             var name =result.data().fname+" "+result.data().lname;
           if (studentsComes.indexOf(name) > -1) {
            return;
           } else {
         studentSdidntCome.push(name)
           }
         })
           console.log("studentSdidntCome",studentSdidntCome);
       return studentSdidntCome;

}

