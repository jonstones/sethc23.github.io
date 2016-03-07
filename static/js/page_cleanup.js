

jQuery.fn.fix_navbar = function () {

    $("#top_navbar").affix();

    function resize_navbar() {
        $('#top_navbar').css( 'margin-left', $('#main').css('margin-left'));
        $('#top_navbar').css( 'margin-right', $('#main').css('margin-right'));
    };

    resize_navbar();

    $( window ).resize(function() {
        resize_navbar();
    });

}