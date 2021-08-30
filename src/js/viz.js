$( document ).ready(function() {
  let viewportWidth = $(window).width()
  let currentSection = 1;
  let dialHeight, dialWidth;
  let map;
  const rotations = [0, 0, 0, 45, 15, -15, -45];
  const credits = ['©UNICEF/UNI82205/Holt','','©UNICEF Chad/2016/Bahaji','Photo credit','©UNICEF Chad/2016/Bahaji'];


  function init() {
    //preload images
    preload([
      'assets/images/main.jpg',
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

    //track links
    $('.linkTrack').on('click', function() {
      let url = $(this).attr('href');
      console.log(url)
      mpTrackLink(url);
    });

    //init mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHVtZGF0YSIsImEiOiJja2FvMW1wbDIwMzE2MnFwMW9teHQxOXhpIn0.Uri8IURftz3Jv5It51ISAA';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/humdata/ckfx2jgjd10qx1bnzkla9px41/',
      center: [15.4723, 12],
      minZoom: 2,
      zoom: 3.5,
      attributionControl: false
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
    dialHeight = ($('.dial').height()<100) ? 703 : $('.dial').height(); //default to 703 height
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
        setPhotoCredit(currentSection-1);
        setDial(currentSection, 'enter');
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        currentSection = id-1;
        setSection(currentSection, 1);
        setPhotoCredit(currentSection-1);
        setDial(currentSection, 'leave');
      })
      //.addIndicators()
      .addTo(controller);
    }

    new ScrollMagic.Scene({
      triggerElement: document.querySelector('#mapZoomTrigger'),
      triggerHook: 0
    })
    .on('enter', function(e) {
      var location = {
        center: [15.4723, 12],
        zoom: 6,
        pitch: 100,
        bearing: 0
      };
      map.flyTo(location);
    })
    .on('leave', function(e) {
      var location = {
        center: [15.4723, 12],
        zoom: 3.5,
        pitch: 0,
        bearing: 0
      };
      map.flyTo(location);
    })
    //.addIndicators()
    .addTo(controller);
  }

  function setSection(step, opacity) {
    $('[data-item="'+step+'"]').css('opacity', opacity);
  }

  function setPhotoCredit(step) {
    $('.credit').html(credits[step]);
    if (step==6)
      $('.credit').hide();
    else
      $('.credit').show();
  }

  function setDial(step, direction) {
    if (step>2 && step<7) {
      if (step==3 || (step==6 && direction=='leave')) {
        $('.dial').animate({
          bottom: -dialHeight,
          opacity: 1,
          width: dialWidth
        }, 1000, 'easeInOutQuart');
      }
      rotateDial(rotations[step]);
    }
    else {
      $('.dial').clearQueue();
      $('.dial').animate({
        bottom: -(dialWidth + 100),
        opacity: 0,
      }, 750, 'easeOutQuart');
    }
  }

  function rotateDial(deg) {
    $('.dial').css('transform', 'rotate('+deg+'deg) translateX(-50%)');
  }

  function showDataviz() {
    $('.dataviz-container').find('.dataviz').hide();
    var currentDataviz = '.dataviz-'+currentSection;
    $('.dataviz-container').find(currentDataviz).show();

    mpTrackInteraction('dataviz view', $(currentDataviz).attr('id'));
  }

  function initTracking() {
    //initialize mixpanel
    let MIXPANEL_TOKEN = window.location.hostname==='data.humdata.org'? '5cbf12bc9984628fb2c55a49daf32e74' : '99035923ee0a67880e6c05ab92b6cbc0';
    mixpanel.init(MIXPANEL_TOKEN);
    mixpanel.track('page view', {
      'page title': document.title,
      'page type': 'datavis'
    });
  }

  function mpTrackInteraction(view, content) {
    mixpanel.track('viz interaction', {
      'page title': document.title,
      'embedded in': window.location.href,
      'action': 'switch viz',
      'viz type': 'climate change data story',
      'current view': view,
      'content': content
    });
  }

  function mpTrackLink(url) {
    mixpanel.track('link click', {
      'embedded in': window.location.href,
      'destination url': url,
      'link type': 'link click',
      'page title': document.title
    });
  }

  initTracking();
  init();
});