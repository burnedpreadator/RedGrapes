scrolltotop = document.getElementById("scroll-top-button");

  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrolltotop.style.display = "block";
  } else {
    scrolltotop.style.display = "none";
  }
}

