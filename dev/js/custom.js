/* MY CUSTOM SCRIPTS */
$(function(){

  $('.menuhandle').on('click', function() {
    if (!$('.sidebar').hasClass('sidebar--opened')) {
      $('.sidebar').addClass('sidebar--opened');
      $('.menuhandle').html('Close <i class="fa fa-close"></i>');
      $('body').append('<div class="menuOverlay"></div>');
    } else {
      $('.sidebar').removeClass('sidebar--opened');
      $('.menuhandle').html('Menu <i class="fa fa-angle-left"></i><i class="fa fa-bars"></i>');
      $('.menuOverlay').remove();
    }
  });

  $('.nav__item--hasChild').mouseover(function() {
    $(".nav__item--hasChild ul").stop().slideDown();
    $('.nav__item--hasChild').mouseleave(function() {
     $(".nav__item--hasChild ul").stop().slideUp();
    });
  })

  $('.btn[href="#contact"]').on('click', function(e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: $('#contact').offset().top - ($(window).outerHeight() / 3.33),
    }, 1000)
  })

  $('.wkshopCarousel').owlCarousel({
    items:1,
    nav: true,
    navContainer: '.wkshopCtrl',
    navText: [
      '<div class="wkshopCtrl__btn wkshopCtrl__btn--left"><div class="wkshopCtrl__arrow wkshopCtrl__arrow--left"></div></div>',
      '<div class="wkshopCtrl__btn wkshopCtrl__btn--right"><div class="wkshopCtrl__arrow wkshopCtrl__arrow--right"></div></div>'
    ]
  });

  function checkIfEmpty(el) {
    el.each(function() {
      $(this).keyup(function() {
        if ($(this).length) {
          $(this).removeClass('empty');
          $(this).keyup(function() {
            if ($(this).val()=='' && !$(this).hasClass('empty')) {
              $(this).addClass('empty');
            }       
          });
        }
      });
    });
  }

  checkIfEmpty($('.contactFm__input'));
  checkIfEmpty($('.contactFm__msg'));

  $(window).on('scroll',function() {
    if ($(window).scrollTop() < 100) {
      $('.backToTop').css({'opacity': '0'});
    } else {
      $('.backToTop').css({'opacity': '1'});
    }
  });

  $('.backToTop').on('click', function(e) {
      e.preventDefault();
      $('html,body').animate({
          scrollTop: 0
        }, 700
      );
  });

});



$('.btn__gallery').featherlightGallery({
    openSpeed: 300
});

$.featherlightGallery.prototype.beforeContent = function() {
  var caption = this.$currentTarget.parentsUntil('.workItem__title').siblings('.workItem__title').html();
  this.$instance.find('.caption').remove();
  $('<div class="caption">').text(caption).prependTo(this.$instance.find('.featherlight-content'));
};


if (window.matchMedia("(max-width: 480px)").matches) {
  $(window).on('scroll', function() {
    if ($(window).scrollTop() <= 200 && $('.sidebar').hasClass('sidebar--minimized')) {
      $('.sidebar').removeClass('sidebar--minimized');
    } else if ($(window).scrollTop() >= 200) {
      $('.sidebar').addClass('sidebar--minimized');
    } else {
      return false;
    }
  });
}