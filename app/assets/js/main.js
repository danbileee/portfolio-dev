$(document).ready(function() {

  //---------------------------------
  // Smooth Scrolling
  //---------------------------------

  $('a[href^="#"]').click(function(){

    var the_id = $(this).attr("href");

    $('html, body').animate({
      scrollTop:$(the_id).offset().top-50
    }, 'slow');

    return false;
  });

  //---------------------------------
  // Header
  //---------------------------------

  $('.js-menu').on('click', function () {
    $('html').toggleClass('menu-is-open');
  });

  //---------------------------------
  // Main Swiper
  //---------------------------------

  var slideContainer = new Swiper('.js-mainslider', {
    slidesPerView: 6.5,
    initialSlide: 0,
    spaceBetween: 60,
    centeredSlides: true,
    loop: true,
    allowTouchMove: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    breakpoints: {
      1201: {
        slidesPerView: 5.3,
        spaceBetween: 55
      },
      981: {
        slidesPerView: 4.3,
        spaceBetween: 50
      },
      767: {
        slidesPerView: 3.8,
        spaceBetween: 40
      },
      521: {
        slidesPerView: 2.3,
        spaceBetween: 40
      }
    }
  });

});