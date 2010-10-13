(function($) {
  $('#already-have-account a').toggle(
    function() {
      $('#sign-in').fadeIn();
    },
    function() {
      $('#sign-in').fadeOut();
    }
  );
})(jQuery);