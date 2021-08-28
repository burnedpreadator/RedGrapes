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

const OpenInfoButtons = document.querySelectorAll('[data-info-target]')
const CloseInfoButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('show')

OpenInfoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const info = document.querySelector(button.dataset.infoTarget)
    openInfo(info)
  })
})


CloseInfoButtons.forEach(button => {
  button.addEventListener('click', () => {
    const info = button.closest(".info")
    closeInfo(info)
  })
})

function openInfo(info){
  if(info == null) return
  info.classList.add('active')
  overlay.classList.add('active')
}


function closeInfo(info){
  if(info == null) return
  info.classList.remove('active')
  overlay.classList.remove('active')
}

