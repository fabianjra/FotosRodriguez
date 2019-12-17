const functions = require('firebase-functions');

//Agregados para el envio de Emails
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

//NOTA: El archivo '.env' se utiliza para guardar las variables de entorno

//Ejecutar solo en entorno de desarrollo
if(process.env.NODE_ENV != 'production')
{
    require("dotenv").config();
}

//Se instancia 'express' y se inicializa cors
const app = express();
app.use(cors({
    origin: true
}));

//Funcion POST, para que cuando se envie un request a: '/', se ejecuta un CallBack (el que ejecuta express)
//Se definen el request y el response
app.post('/', (req, res) => {
    
    //Se obtiene el body del request
    const {body} = req;

    //Validar que el body contenta: mensaje, a quien y asunto.
    const mensajeValido = body.message && body.to && body.subject

    if(!mensajeValido)
    {
        return res.status(400).send({
            message: 'invalid request'
        })
    }

    //Se crea un transporter, para configurar el servicio que envia los correos.
    //Se configura las credenciales para el envio
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "login",
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    //Configuracion de las opciones del envio del Email
    const mailOptions = {
        from: process.env.EMAIL,
        to: body.to,
        subject: body.subject,
        text: body.message
    };

    //Con el Transporter se envia el correo (recibe un CallBack)
    //El callback como primer parametro recibe un error y segundo un data.
    transporter.sendMail(mailOptions, (err, data) => {

        //Se valida el error, si existe: se envia error 500 por ser error en el servidor
        if(err)
        {
            return res.status(500).send({
                message: "Error al enviar Email: " + err.message
            });
        }

        //Si no hay error al enviar Email (no se le pasa status, para que por defecto se determine que es un 200)
        return res.send({
            message: "Correo enviado satisfactoriamente"
        });
    });

}); //FIN: Post


//Cuando el Post se realice (se envie el correo), hay que indicarle a los functions de Google, que 'express' va a responder por el, cuando se realice una petición POST.
//se le pasa por parametro al "functions" de firebase, la instancia de "express"
module.exports.mailer = functions.https.onRequest(app);