$( document ).ready(function() {
  let viewportWidth = $(window).width()
  let currentSection = 1;
  let dialHeight, dialWidth;
  const rotations = [0, 0, 0, 45, 15, -15, -45];
  const credits = ['Photo credit','Photo credit','©UNICEF Chad/2016/Bahaji','Photo credit','©UNICEF Chad/2016/Bahaji'];

  function init() {
    //preload images
    preload([
      'assets/images/1-main.jpeg',
      'assets/images/home.jpg',
      'assets/images/river.jpg',
      'assets/images/farm.jpg',
      'assets/images/water.jpg'
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
    initDial();
    initSections();

    $('.loader').hide();
    $('main').css('opacity', 1);
  }

  function initDial() {
    dialHeight = $('.dial').height();
    dialWidth = viewportWidth>=768 ? 800 : viewportWidth*1.2;
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
        setSection(currentSection-1, 0);
        setDial(currentSection, 'enter');
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id-1;
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

  function setSection(step, opacity) {
    $('[data-item="'+step+'"]').css('opacity', opacity);

    //set photo credit
    $('.credit').html(credits[step]);
    if (step==6)
      $('.credit').hide();
    else
      $('.credit').show();
  }

  function setDial(step, direction) {
    $('.dial').clearQueue();
    if (step>2 && step<7) {
      if (step==3 || (step==6 && direction=='leave')) {
        $('.dial').animate({
          bottom: -dialHeight,
          width: dialWidth
        }, 1000, 'easeInOutQuart');
      }
      rotateDial(rotations[step]);
    }
    else {
      $('.dial').animate({
        bottom: -(dialWidth + 100),
      }, 750, 'easeOutQuart');
    }
  }

  function rotateDial(deg) {
    $('.dial').css('transform', 'rotate('+deg+'deg) translateX(-50%)');
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