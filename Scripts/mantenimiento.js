$(document).ready(function () {
    ConsultaUsarioActivo();
});

function ConsultaUsarioActivo() {
    try {
        var firebaseConfig = uCargarCredencialesFirebase();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //If user is no active, go to the initial page
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;

                //Can use the vars for wharever you want.
            } else {
                // User is signed out.
                window.location = "iniciarsesion.html";
            }
        });
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function DescargarDB() {
    
    var firebaseConfig = uCargarCredencialesFirebase();

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }


    console.log("1");
    var getJSON = firebase.functions().httpsCallable('getJSON');
    console.log("2");

    getJSON().then(function(result) {
        console.log("Then: " + JSON.stringify(result.data));
    }).catch(function(error) {
        // Getting the Error details.
        var code = error.code;
        var message = error.message;
        var message = error.details;
        
        
        console.log("code: " + code);
        console.log(message);
        console.log(message);
    });

}