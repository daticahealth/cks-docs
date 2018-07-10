$(window).on("load",function(){
  // Table of contents
  $("#toc").tocify({
    context : "#content",
    selectors : "h1,h2,h3",
    hideEffect : "none",
    showAndHide : false,
    showAndHideOnScroll : false,
    highlightOnScroll : true,
    highlightOffset : 0,
    theme: "none",
    extendPage : false,
    extendPageOffset : 0
  });
});

// Nav wrapper

$(window).on("scroll", function (event){
  var nw = $("#nav-wrapper");
  var sc = $(window).scrollTop();

  if (sc >= 100){
    nw.addClass("fixIt");
  } else {
    nw.removeClass("fixIt");
  }
});

$(window).on("load", function(){
  var w = $(".col-xs-3").width();
  var n = $("#nav-wrapper");

  console.log(w);

  n.css({"width" : w - 16});
});

$(window).on("resize", function(){
  var w = $(".col-xs-3").width();
  var n = $("#nav-wrapper");

  console.log(w);

  n.css({"width" : w - 16});
});
