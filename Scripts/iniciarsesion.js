ConsultaUsarioActivo();

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

                        let mensajeEvento = "Se hizo un nuevo login| User:" + email + "| Pass:" + password;
                        uEscribirEventoAccion(mensajeEvento)

                        window.location = "mantenimiento.html";
                    });
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    let mensajeEvento = "Intento erroneo de login| User:" + email + "| Pass:" + password + "| codigo:" + errorCode;
                    uEscribirEventoAccion(mensajeEvento)

                    document.getElementById('lblError').innerHTML = errorMessage;
                });
        }
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function ConsultaUsarioActivo() {
    try {
        var firebaseConfig = uCargarCredencialesFirebase();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //If user is no active, go to the initial page
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                window.location = "mantenimiento.html";
            }
        });
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}