$(function() {
  // Table of contents
  $("#toc").tocify({
    context : "#content",
    selectors : "h1,h2,h3",
    // hideEffect : "none",
    // showAndHide : false,
    // showAndHideOnScroll : true,
    // highlightOnScroll : true,
    // highlightOffset : 0,
    // theme: "none",
    // extendPage : false,
    // extendPageOffset : 0
  });
});

// Nav wrapper

$(window).on("scroll", function (event){

  var nw = $("#nav-wrapper");
  var sc = $(window).scrollTop();

  if ((sc >= 100) && ($(window).width() > 767)){
    nw.addClass("fixIt");
  } else {
    nw.removeClass("fixIt");
  }
});

// Grab the width of the outer collumn and apply it to the fixed class so it has a width

$(window).on("load resize", function(){
  var w  = $(".col-xs-3").width();
  var n  = $("#nav-wrapper");
  var m  = $(".main-nav");
  var mm = $(".mobile-menu-button");
  var l  = $(".left-nav-mobile");
  var ll = $(".left-nav");
  var b  = $(".close-mobile-menu-button")

  console.log(w);

  n.css({"width" : w - 16});

  mm.on("click", function(){
    l.addClass("showhelper");
    ll.addClass("showhelper");
    b.addClass("showhelper");
  });

  b.on("click", function(){
    l.removeClass("showhelper");
    ll.removeClass("showhelper");
    b.removeClass("showhelper");
  });

});
