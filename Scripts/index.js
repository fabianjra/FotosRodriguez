$(document).ready(function () {

    //Cambiar NavBar al hacer scroll
    $(function () {
        $(window).scroll(function () {

            //Cuando baja
            if ($(".navbar").offset().top > 90) {

                $("nav > .navbar-brand > label").removeClass("tituloLabelNormal");
                $("nav > .navbar-brand > label").addClass("tituloLabelSmall");
               
                $("nav > .navbar-brand > img").removeClass("imgLogoNavTop");
                $("nav > .navbar-brand > img").addClass("imgLogoNavDown");

                $("nav > .navbar-collapse > form > a > img").removeClass("imgLogoNavTop");
                $("nav > .navbar-collapse > form > a > img").addClass("imgLogoNavDown");

            } else {
                //Cuando esta en el top

                $("nav > .navbar-brand > label").removeClass("tituloLabelSmall");
                $("nav > .navbar-brand > label").addClass("tituloLabelNormal");
               
                $("nav > .navbar-brand > img").removeClass("imgLogoNavDown");
                $("nav > .navbar-brand > img").addClass("imgLogoNavTop");

                $("nav > .navbar-collapse > form > a > img").removeClass("imgLogoNavDown");
                $("nav > .navbar-collapse > form > a > img").addClass("imgLogoNavTop");
            }
        });
    });

});