import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD91v4LsW6wytMO6tJoUE7xyVz6BLTm5jk",
    authDomain: "ybl-project-b5e04.firebaseapp.com",
    databaseURL: "https://ybl-project-b5e04.firebaseio.com",
    projectId: "ybl-project-b5e04",
    storageBucket: "ybl-project-b5e04.appspot.com",
    messagingSenderId: "288673703911",
    appId: "1:288673703911:web:e0cc3b8ea3fc61019c3f42",
    measurementId: "G-1RWZH22PZ6"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;


export async function RegisterUser(email,user) {
    await db.collection("waitforapproval").doc(email).set(user);
    return;
}
export async function DeleteUser(email,) {
    await db.collection("waitforapproval").doc(email).delete();
    return;
}

export async function CreateUser(user) {
    console.log(user)
    var res = await auth.createUserWithEmailAndPassword(user.email,user.phone)
    auth.currentUser.updateProfile({displayName:user.fname+" "+ user.lname})
    if(user.type==="testers") {
        await db.collection("students").doc(res.user.uid).set(user)
        await db.collection("guides").doc(res.user.uid).set(user)
        await db.collection("managers").doc(res.user.uid).set(user)
    }
    await  db.collection(user.type).doc(res.user.uid).set(user)
    var team=await db.collection('Teams').doc(user.team.id);
    team.set({
        name: user.teamName,
        guide: db.doc('guides/'+res.user.uid)
    })

    // await db.collection("waitforapproval").doc(user.email).delete();
    await DeleteUser(user.email)
    console.log("done the user is ready")
    return true;
}

export async function CreateNewTeam(team) {
    await  db.collection("Teams").doc().set({name:team})
    console.log("done")
}

export async function checkUser() {
   const user =await auth.onAuthStateChanged();
   return user
}

export async function signOut() {
   await auth.signOut();
    return
}

export async function getGuide(uid) {
    var guide = await db.collection("guides").doc(uid);
    console.log(guide);
    return guide;
}

export async function getGuideData(uid) {
    var guideData = await (await db.collection("guides").doc(uid).get()).data();
    console.log(guideData);
    return guideData;
}

export async function getGuideFormByDate(uid, date) {
    var guideData = await (await db.collection("guides").doc(uid).collection("comes").doc(date).get()).data();
    console.log(guideData);
    return guideData;
}

export async function getPathData(path) {
    var guideData =await (await db.doc(path).get()).data();
    console.log(guideData);
    return guideData;
}

export async function getGuideForms(uid) {
    var forms = [];
    var guideData = await db.collection("guides").doc(uid).collection("comes").get();
    console.log(guideData.docs[0].data());
    guideData.docs.forEach(doc=>{
        forms.push(doc.data());
    })
    console.log(forms);
    return forms;
}

export async function getStudent(uid) {
    var student = await db.collection("students").doc(uid);
    console.log(student);
    return student;
}

export async function getStudentData(uid) {
    console.log(uid)
    var studentData = await (await db.collection("students").doc(uid).get()).data();
    console.log(studentData);
    return studentData;
}

export async function getStudentFormByDate(uid, date) {
    var studentFormByDate = await (await db.collection("students").doc(uid).collection("comes").doc(date).get()).data();
    console.log(studentFormByDate);
    return studentFormByDate;
}

export async function getStudentForms(uid) {
    var forms = [];
    var studentData = await db.collection("students").doc(uid).collection("comes").get();
    console.log(studentData.docs[0].data());
    studentData.docs.forEach(doc=>{
        forms.push(doc.data());
    })
    console.log(forms);
    return forms;
}



export async function getManager(uid) {
    var manager = await db.collection("managers").doc(uid);
    console.log(manager);
    return manager;
}

export async function getManagerData(uid) {
    var managerData = await (await db.collection("managers").doc(uid).get()).data();
    console.log(managerData);
    return managerData;
}
export async function getTeamFeedbackByDate(teamPath,date) {
    var team = await db.collection("Teams").doc(teamPath).collection("Dates").doc(date).get();
    var teamFeedback=team.data()
    console.log(teamFeedback);
    return teamFeedback;
}
//
// class Firebase {
//     constructor() {
//         firebase.initializeApp(firebaseConfig)
//         this.auth = firebase.auth()
//         this.db = firebase.firestore()
//     }
//
//     login(email, password) {
//         return this.auth.signInWithEmailAndPassword(email, password)
//     }
//
//     logout() {
//         return this.auth.signOut()
//     }
//
//     async register(name, email, password) {
//         await this.auth.createUserWithEmailAndPassword(email, password)
//         return this.auth.currentUser.updateProfile({
//             displayName: name
//         })
//     }
//
//
//
//     isInitialized() {
//         return new Promise(resolve => {
//             this.auth.onAuthStateChanged(resolve)
//         })
//     }
//
//     getCurrentUsername() {
//         return firebase.auth().currentUser //&& this.auth.currentUser.displayName
//     }
//
// }

// export default Firebase;