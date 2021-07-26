$( document ).ready(function() {
  const DATA_URL = 'data/';
  let isMobile = $(window).width()<600? true : false;
  let dataUrls = ['geodata_locations.geojson'];

  function init() {
    //preload slideshow images
    preload([
      'assets/images/1-main.jpeg',
      'assets/images/2-girl.jpeg',
      'assets/images/3-drought.jpeg',
      'assets/images/4-cattle.jpeg',
      'assets/images/5-farm.jpeg',
      'assets/images/6-well.jpeg'
    ]);

    initBackgroundImages();
  }

  function initBackgroundImages() {
    var controller = new ScrollMagic.Controller();
    var sections = document.querySelectorAll('.section');
    for (var i=0; i<sections.length; i++) {
      new ScrollMagic.Scene({
        triggerElement: sections[i],
        triggerHook: 0.9
      })
      .on('enter', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        $('[data-img="'+(id-1)+'"]').css('opacity', 0);
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('section'));
        $('[data-img="'+(id-1)+'"]').css('opacity', 1);
      })
      .addTo(controller);
    }
  }

  function getData() {
    dataUrls.forEach(function (url, index) {
      loadData(url, function (responseText) {
        parseData(JSON.parse(responseText), index);
      })
    })
  }

  function loadData(dataPath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText) }
    xhr.open('GET', DATA_URL+dataPath, true);
    xhr.send();
  }

  function parseData(geoData, index) {
    //do something with the data
    console.log(geoData, index)
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

  //getData();
  //initTracking();
  init();
});