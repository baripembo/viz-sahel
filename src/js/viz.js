$( document ).ready(function() {
  let viewportWidth = $(window).width()
  let currentSection = 1;
  let dialHeight, dialPos, dialWidth, dialWidthZoom;
  const rotations = [0, 0, 0, 45, 15, -15, -45];

  function init() {
    //preload images
    preload([
      'assets/images/1-main.jpeg',
      'assets/images/home.jpg',
      'assets/images/river.jpg',
      'assets/images/farm.jpg',
      'assets/images/well.jpg'
    ]);

    //btn to dataviz
    $('.btn-dataviz').on('click', function() {
      showDataviz();
      $('body').css('overflow-y', 'hidden');
      $('.dataviz-container').scrollTop(0).animate({
        left: 0
      }, 500, 'easeOutQuart', function() {
        $('.btn-story').addClass('active');
      });
    });

    //btn back to story
    $('.btn-story').on('click', function() {
      $(this).removeClass('active');
      $('.nav-dataviz').hide();
      $('body').css('overflow-y', 'auto');
      $('.dataviz-container').animate({
        left: '100vw'
      }, 500, 'easeOutQuart');
    });

    initSections();
  }

  function preload(imgArray) {
    var loadedCount = 0
    $(imgArray).each(function(){
      var img = new Image();
      img.src = this;
      img.onload = function() {
        loadedCount++;
        if (loadedCount==imgArray.length) {
          loadComplete();
        }
      }
    });
  }

  function loadComplete() {
    $('.loader').hide();
    $('main').css('opacity', 1);

    //init dial
    dialHeight = $('.dial').height();
    dialPos = dialHeight * 0.74;
    dialWidth = viewportWidth>=768 ? 660 : viewportWidth;
    dialWidthZoom = viewportWidth>=768 ? 800 : viewportWidth*1.2;
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
        $('.btn-dataviz').removeClass('animate');
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id;
        setNav(currentSection);
        setSection(currentSection-1, 0);
        setDial(currentSection, 'enter');
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id-1;
        setNav(currentSection);
        setSection(currentSection, 1);
        setDial(currentSection, 'leave');
      })
      //.addIndicators()
      .addTo(controller);

      new ScrollMagic.Scene({
        triggerElement: sections[i],
        offset: $(sections[i]).height() * 0.4
      })
      //.setTween(exit)
      .on('enter', function(e) {
        $('.btn-dataviz').addClass('animate');
      })
      // .addIndicators({
      //   name: "Exit Timeline"
      // })
      .addTo(controller);
    }
  }

  function setNav(id) {
    //set dataviz nav
    if (id>2 && id<=6) {
      $('.btn-dataviz').addClass('active');
      //set light/dark variation
      if (id>=4)
        $('.btn-dataviz').addClass('light');
      else
        $('.btn-dataviz').removeClass('light');
    }
    else {
      $('.btn-dataviz').removeClass('active');
    }
  }

  function setSection(step, opacity) {
    $('[data-item="'+step+'"]').css('opacity', opacity);
    if (step==6)
      $('.credit').hide();
    else
      $('.credit').show();
  }

  function setDial(step, direction) {
    $('.dial').clearQueue();
    if (step>1 && step<7) {
      if (step==2) {
        if (direction=='leave') {
          rotateDial(0, 0);
        }
        $('.dial').animate({
          bottom: -dialPos,
          opacity: 1,
          width: dialWidth
        }, 1000, 'easeOutQuart');
      }
      else if (step==3 || (step==6 && direction=='leave')) {
        $('.dial').animate({
          bottom: -dialHeight,
          opacity: 1,
          width: dialWidthZoom
        }, 1000, 'easeInOutQuart');
        rotateDial(rotations[step], 750);
      }
      else {
        rotateDial(rotations[step], 0);
      }
    }
    else {
      $('.dial').animate({
        bottom: -dialHeight,
        opacity: 0,
        width: dialWidth
      }, 750, 'easeOutQuart', function() {
        rotateDial(0, 0);
      });
    }
  }

  function rotateDial(deg, delay) {
    $('.dial').delay(delay).css('transform', 'rotate('+deg+'deg) translateX(-50%)');
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