scrolltotop = document.getElementById("scroll-top-button");

window.onscroll = function() {scrollFunction()};


function scrollFunction() {
  if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
    scrolltotop.style.display = "block";
  } else {
    scrolltotop.style.display = "none";
  }
}



