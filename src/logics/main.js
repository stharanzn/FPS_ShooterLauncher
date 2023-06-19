const {firebase, initializeApp} = require('firebase/app')
const dotenv = require('dotenv')
const {auth, getAuth, onAuthStateChanged, signInWithEmailAndPassword} = require('firebase/auth')
const uaup = require('uaup-js')


dotenv.config();



// #region FIELDS
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

const subBtn = document.getElementById("submitBtn")
const email = document.getElementById("emailIn")
const pass = document.getElementById("passwordIn")


// #endregion

const firebaseApp = initializeApp(firebaseConfig);
const _auth = getAuth(firebaseApp)
showLoginFrag();

// #region eventListeners

subBtn.addEventListener("click", ()=>{
    loginUser();
})



// #endregion


// #region firebase

function loginUser(){
    console.log(email.value + pass.value)
    var _password = getHashedPass(pass.value)

    signInWithEmailAndPassword(_auth, email.value, _password).then((userCred)=>{
        const user = userCred.user
        console.log(user.uid)

    }).catch((err)=>{
        console.log(err)
    })

}

onAuthStateChanged(_auth, (user)=>{
    if(user){
        console.log(user);
        process.env._authState = true
        defaultOptions._authState = true;
        console.log("user exists: login")
        const uid = user.uid
        startApp(uid)
    }else{
        console.log("user not found: relogin")
        showLoginFrag();
    }
})

// #endregion

// #region misc
document.getElementById("close").addEventListener("click", ()=>{    
    window.close();
    process.close();
    
})

function getHashedPass(pass){
    return `${pass}123`
}

function showLoginFrag(){
    document.getElementById("login-box").classList.remove("hide");
}

// #endregion

// #region uaup
var app_library = (process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")) + "\\";

console.log(process.env.APPDATA, process.env.HOME)

//set default stages of the process.
const defaultStages = {
    Checking: "Checking For Updates...",
    Found: "Update Found!",
    NotFound: "Build Upto Date",
    Downloading: "Downloading...",
    Unzipping: "Installing...",
    Cleaning: "Finalizing...",
    Launch: "Let's roll..."    
};


const defaultOptions = {
    useGithub: true,
    gitRepo: "FPSShooter",
    gitUsername: "stharanzn",
    isGitRepoPrivate: false,

    _userUid: process.env.userUid,
    _authState: false,

    appName: "FPS_Shooter",
    appExecutableName: "FPS_Shooter.exe",

    appDirectory: app_library + "FPS_Shooter",
    versionFile: app_library + "/FPS_Shooter/settings/version.json",
    tempDirectory: app_library + "/FPS_Shooter/tmp",

    loginBox: document.getElementById("login-box"),
    progressBar: document.getElementById('download'),
    launchBtn: document.getElementById('launchScreen'),
    label: document.getElementById('statusLabel'),
    forceUpdate: false,
    stageTitles: defaultStages
};

uaup.Update(defaultOptions);

// document.getElementById('launchApp').addEventListener('click', function(event){

//     uaup.LaunchApplication(defaultOptions)
// })

//#endregion

document.getElementById("launchApp").addEventListener('click', launchOnClick);

function launchOnClick(){    
    startApp(defaultOptions._userUid);
}

function startApp(uid){
    if(process.env.isDownloaded){
        console.log("start app")
        defaultOptions._userUid = uid;
        defaultOptions._authState = true;
        uaup.LaunchApplication(defaultOptions);
    }else{
        document.getElementById('login-box').classList.add("hide");
    }

    
}
// #endregion