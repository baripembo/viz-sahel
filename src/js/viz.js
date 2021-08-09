$( document ).ready(function() {
  let isMobile = $(window).width()<600? true : false;
  let currentSection = 1;
  const rotations = [0, 0, 0, 60, 30, 0, -30, -60]

  function init() {
    //preload images
    preload([
      'assets/images/1-main.jpeg',
      'assets/images/home.jpg',
      'assets/images/river.jpg',
      'assets/images/cattle.jpg',
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

    //story nav events 
    $('.nav-story li').on('click', function() {
      var id = $(this).attr('data-id');
      var target = $('#'+id);
      var top = target.offset().top - $(window).height()/2 + target.find('.box:first-child p').height()/2;
      console.log(id, $('#'+id).offset().top, $('.nav-story').height(), top)
      $('html, body').animate({
        scrollTop: top
      }, 1000, 'easeOutQuad');
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
        setNav(id-2);
        setSection(id-1, 0);
        setDial(id, 'enter');
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id-1;
        setNav(id-3);
        setSection(id-1, 1);
        setDial(id-1, 'leave');
      })
      .addTo(controller);
    }
  }

  function setNav(id) {
    //set main nav
    if (id>0 && id<6) {
      $('.nav-story').show();
    }
    else {
      $('.nav-story').hide();
    }
    $('nav li').removeClass('active');
    $('nav ul li:nth-child('+id).addClass('active');

    //set dataviz nav
    if (id>-1 && id<6) {
      $('.btn-dataviz').addClass('active');
      //set light/dark variation
      if (id==2 || id==4 || id==5)
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
  }

  function setDial(step, direction) {
    $('.dial').clearQueue();
    if (step>1) {
      if (step==2 || step==8) {
        if (step==8 || direction=='leave') {
          rotateDial(0, 0);
        }
        $('.dial').animate({
          bottom: -445,
          opacity: 1,
          width: 660
        }, 1000, 'easeOutQuart');
      }
      else if (step==3 || (step==7 && direction=='leave')) {
        $('.dial').animate({
          bottom: -720,
          opacity: 1,
          width: 800
        }, 1000, 'easeInOutQuart');
        rotateDial(rotations[step], 750);
      }
      else {
        rotateDial(rotations[step], 0);
      }
    }
    else {
      $('.dial').animate({
        bottom: -720,
        opacity: 0,
        width: 660
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
    if (id>1) {
      $('.nav-dataviz').show();
    }
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