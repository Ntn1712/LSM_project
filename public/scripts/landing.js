// change background color on scrolling
$(window).scroll(function(){
    if($(this).scrollTop() > 343)
    {
        $(".navbar-expand-lg").addClass("opaque");
    } else {
        $(".navbar-expand-lg").removeClass("opaque");
    }
});