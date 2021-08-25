$("#ulactive li").click(function() {
  
  $(this).addClass("active");
  $('.target').hide();
  $('.type' +$(this).attr('target')).show();
  $("li").not(this).removeClass("active");

})

$(function(){
  $('#ALL').click(function(){
    $('.target').show();
  })
});
