/*
Custom off-cavas menu for Panke
 */

(function ($) {

    var menu_active=false;

    function enableOffCanvas() {

        $('.toggle-menu').click(function () {
              toggleMenu();
        });

        if (menu_active == true){
            $('.container').click(function () {
              toggleMenu();
            });
        }


    }

    function toggleMenu() {
        if (menu_active == false) menu_active=true;
        else menu_active=false;

        $(".off-canvas").toggleClass("menu-active");
        $(".container").toggleClass("menu-active");

        toggleIconClass();
    }

    function toggleIconClass() {
        if (menu_active==true){
            $(".menu-icon").removeClass("glyphicon-menu-hamburger");
            $(".menu-icon").addClass("glyphicon-remove");
        }else{
            $(".menu-icon").addClass("glyphicon-menu-hamburger");
            $(".menu-icon").removeClass("glyphicon-remove");
        }
    }

    $(document).ready(function () {

        enableOffCanvas();

    });

})(jQuery);
