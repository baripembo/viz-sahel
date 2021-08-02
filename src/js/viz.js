$( document ).ready(function() {
  let isMobile = $(window).width()<600? true : false;
  let currentSection = 1;
  const rotations = [0, 0, 0, 60, 30, 0, -30, -60]

  function init() {
    //preload images
    preload([
      'assets/images/1-main.jpeg',
      'assets/images/2-girl.jpeg',
      'assets/images/3-drought.jpeg',
      'assets/images/4-cattle.jpeg',
      'assets/images/5-farm.jpeg',
      'assets/images/6-well.jpeg'
    ]);

    $('.nav-dataviz').on('click', function() {
      showDataviz();
      $('.dataviz-container').animate({
        left: 0
      }, 500, 'easeOutQuart', function() {
        $('.nav-main').show();
      });
    });

    $('.nav-main').on('click', function() {
      $('.nav-main').hide();
      $('.dataviz-container').animate({
        left: '100vw'
      }, 500, 'easeOutQuart');
    });

    initSections();
  }

  function initSections() {
    var controller = new ScrollMagic.Controller();
    var sections = document.querySelectorAll('.section');
    for (var i=0; i<sections.length; i++) {
      new ScrollMagic.Scene({
        triggerElement: sections[i],
        triggerHook: 0.9
      })
      .on('enter', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id;
        toggleSection(id-1, 0);
        rotateDial(id, 'enter');
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id-1;
        toggleSection(id-1, 1);
        rotateDial(id-1, 'leave');
      })
      .addTo(controller);
    }
  }

  function toggleSection(step, opacity) {
    $('[data-item="'+step+'"]').css('opacity', opacity);
  }

  function rotateDial(step, direction) {
    $('.dial').clearQueue();
    if (step>=2) {
      if (step==2 || step==8) {       
        $('nav, .nav-dataviz').hide();
        if (step==8 || direction=='leave') { 
          $('.dial').css('transform', 'rotate(0deg) translateX(-50%)');
          $('.dial').delay(700).animate({
            bottom: -445,
            width: 660
          }, 1000, 'easeOutQuart', function() {
            $('.dial').css('opacity', 1);
          });
        }
        else {
          $('.dial').css('opacity', 1);
          $('.dial').delay(500).animate({
            bottom: -445,
            width: 660
          }, 1000, 'easeOutQuart');
        }
      }
      else if (step==3) {
        $('.dial').animate({
          bottom: -720,
          opacity: 1,
          width: 800
        }, 1000, 'easeInOutQuart', function() {
          $('.dial').css('transform', 'rotate(' + rotations[step] + 'deg) translateX(-50%)');
          $('nav, .nav-dataviz').show();
        });
      }
      else if (step==8 || direction=='leave') {
        $('nav, .nav-dataviz').show();
        $('.dial').animate({
          bottom: -720,
          width: 800,
        }, 1000, 'easeInOutQuart');
        $('.dial').delay(500).css('transform', 'rotate(' + rotations[step] + 'deg) translateX(-50%)');
      }
      else {
        $('.dial').css('transform', 'rotate(' + rotations[step] + 'deg) translateX(-50%)');
      }
    }
    else {
      $('.dial').animate({
        bottom: -710,
        opacity: 0,
        width: 660
      }, 750, 'easeOutQuart', function() {
        $('.dial').css('transform', 'rotate(0deg) translateX(-50%)');
      });
    }
  }

  function showDataviz() {
    let id = Number(currentSection)-1
    $('.dataviz-container').find('.dataviz').hide();
    $('.dataviz-container').find('.dataviz-'+id).show();
  }

  function initTracking() {
    //initialize mixpanel
    let MIXPANEL_TOKEN = '';
    mixpanel.init(MIXPANEL_TOKEN);
    mixpanel.track('page view', {
      'page title': document.title,
      'page type': 'datavis'
    });
  }

  //initTracking();
  init();
});