(function($){
  $(function(){

  
    $('.sidenav').sidenav();
    $('.sidenav-trigger').sidenav();
    $('.parallax').parallax();
    $(".modal").modal();

    $(".dropdown-trigger").dropdown({
      coverTrigger: false
    });

    $('.carousel').carousel({
      dist: -200,
      indicators: true,
      fullWidth: true
    });

    $('.collapsible').collapsible();
    $('.datepicker').datepicker({
      format: "yyyy-mm-dd",
      showClearBtn: true
    });
    $('.materialboxed').materialbox();
    $('select').formSelect();
    $('.tabs').tabs();


  }); // end of document ready
})(jQuery); // end of jQuery name space

