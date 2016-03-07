
jQuery.fn.fix_sidebar = function () {

    $('#sidebar').toc({ title : '',
                        minimumHeaders: 1, 
                        listType: 'ul',
                        showEffect : 'none',
                        showSpeed : '0' });
    $('#sidebar>ul').replaceWith($('#sidebar>ul').contents());
    $('#sidebar > li').find('ul').addClass('nav bs-docs-sidenav nav-stacked');


    $('#rightCol').css({'-webkit-box-shadow': '', 'box-shadow': ''});


    $('body').scrollspy({
      target: '.bs-docs-sidebar',
      offset: 40
    });
    $("#rightCol").affix();


    // docViewTop = $('#rightCol').offset().top; docViewBottom = docViewTop + $('#rightCol').height(); elemTop = $("#sidebar > li.active").offset().top; elemBottom = elemTop + $("#sidebar > li.active").height();

    // Keep Highlighted element in TOC visible during scrolling
    $("#sidebar > li").on('activate', function() {
        var docViewTop = $('#rightCol').offset().top;
        var docViewBottom = docViewTop + $('#rightCol').height();
        var elemTop = $("#sidebar > li.active").offset().top;
        var elemBottom = elemTop + $("#sidebar > li.active").height();
        if (  // if element NOT in view -- while scrolling down
            (elemBottom >= docViewBottom) || 
             (elemTop <= docViewTop)
            ) {
            var half_window_height = $('#rightCol').height() / 2;
            $('#rightCol').scrollTop($('#sidebar > li.active').position().top);
            if ( elemBottom >= docViewBottom ) {
                $('#rightCol').scrollTop($('#sidebar > li.active').position().top + half_window_height);
            } else if ( elemTop <= docViewTop ) {
                $('#rightCol').scrollTop($('#sidebar > li.active').position().top - half_window_height);
            }
        }
    });


    function resize_right_col() {
    $('#rightCol').css({left: ((parseInt($('#right_col_div').position().left) + 
                                parseInt($('#right_col_div').css('width'))) - 
                                parseInt($('#rightCol').css('width'))-15)})
    };
    resize_right_col();
    $( window ).resize(function() {
        resize_right_col();
    });


}