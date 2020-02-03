$(document).ready(function () {

    //Limpia el mensaje de error
    $('#txtEmail').on('input propertychange paste', function () {
        document.getElementById('lblError').innerHTML = "";
    });

    $('#txtPassword').on('input propertychange paste', function () {
        document.getElementById('lblError').innerHTML = "";
    });
});

function InicarSesion() {
    try {
        document.getElementById('lblError').value = "";

        let email = document.getElementById('txtEmail').value;
        let password = document.getElementById('txtPassword').value;

        if (uTrim(email) == "" || uTrim(password) == "") {
            document.getElementById('lblError').innerHTML = "Se deben ingresar los campos";
        } else {

            //Login
            var firebaseConfig = uCargarCredencialesFirebase();

            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function () {
                    // Handle success here
                    firebase.auth().onAuthStateChanged(user => {
                        // sessionStorage.setItem("email", email);
                        window.alert("Bienvenido " + user.email);
                        window.location = "mantenimiento.html";
                    });
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    document.getElementById('lblError').innerHTML = errorMessage;
                });
        }
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}