function sectionClickHandler(event) {
    // console.log(section.attr('id'));
    var section = $(event.target);
    selectSection(section);
}

// the function name should be changed, since the era is also called section
function selectSection(section) {
    if (!section.hasClass('selected')) {
        openSection(section);
        // check if it's section or era
        if (section.hasClass('section')) {
            $('a.section').each(function(index) {
                if ($(this)[0] != section[0] && $(this).hasClass('selected')) {
                    closeSection($(this));
                };
            });
        } else if (section.hasClass('era')) {
            // console.log(section.attr('title'));
            $('ul.era') .each(function(index) {
                if ($(this)[0] != section[0] && $(this).hasClass('selected')) {
                    closeSection($(this));
                };
            });
        };
    }
}
var toc_height;
var preset_height;
var new_height;
function openSection(section) {
    // console.log("open " + section.text());
    section.addClass('selected');
    if (section.attr('id') == 'history-link') {
        var toc_position_top = $('#toc').offset().top - $(window).scrollTop();
        var new_height = $(window).height() - 20 - toc_height - 15; // 20 is buffer.
        // console.log("preset_height "+preset_height);
        // console.log("new_height "+new_height);
        if (preset_height > new_height) {
            $('#history-detail-container').css('height', new_height + 'px');
            $('#history-detail-container').mouseenter(function(event) {
                // console.log("mouse over");
                document.documentElement.style.overflow = 'hidden';
            });
            $('#history-detail-container').mouseleave(function(event) {
                // console.log("mouse out");
                document.documentElement.style.overflow = '';
            });
            // $('#history-detail-frame').css('overflow', 'visible');
            // $('#history-detail-container').css('overflow', 'scroll');
        };
        $('#history-detail-frame').slideToggle("fast");
        // section.find('+ div').slideToggle("fast");
    };
    if (section.hasClass('era')) {
        if (section.position().top >= 0 && section.position().top + section.height() <= $('#history-detail-container').height()) {
            return;
        } else {
            $('#history-detail-container').scrollTop(section.position().top);
        }
    };
}
function closeSection(section) {
    section.removeClass('selected');
    if (section.attr('id') == 'history-link') {
        section.find('+ div').slideToggle("fast");
    };
}

var topdown_focus_bar;
function checkFocusTopdown(elements) {
    var selectedIndex = -1;
    elements.each(function(index) {
        if ($(this).offset().top - $(window).scrollTop() > topdown_focus_bar) {
            return false;
        } else {
            selectedIndex = index;
            return true;
        }
    });
    return selectedIndex;
}
function scrollDown() {
    // if document is near bottom then select the last
    if($(window).scrollTop() + $(window).height() > $(document).height() - 25) {
        selectSection($('a.section:last'));
        return;
    }

    var selectedSectionIndex = checkFocusTopdown($('div.content'));
    if (selectedSectionIndex > -1) {
        var selectedSection = $('a.section').eq(selectedSectionIndex);
        selectSection(selectedSection);
    };

    if ($('#history-link').hasClass('selected')) {
        var selectedEraIndex = checkFocusTopdown($('span.eraloc'));
        if (selectedEraIndex > -1) {
            var selectedEra = $('ul.era').eq(selectedEraIndex);
            selectSection(selectedEra);
        };
    };
}

var bottomup_focus_bar;
function checkFocusBottomup(elements) {
    var selectedIndex = -1;
    $(elements.get().reverse()) .each(function(index) {
        if ($(this).offset().top - $(window).scrollTop() > bottomup_focus_bar) {
            return true;
        } else {
            selectedIndex = elements.length - index - 1;
            return false;
        }
    });
    return selectedIndex;
}
function scrollUp() {
    // if document is near bottom then select the last
    if($(window).scrollTop() + $(window).height() > $(document).height() - 25) {
        selectSection($('a.section:last'));
        return;
    }

    var selectedIndex = checkFocusBottomup($('div.content'));
    if (selectedIndex > -1) {
        var selectedSection = $('a.section').eq(selectedIndex);
        selectSection(selectedSection);
    };

    if ($('#history-link').hasClass('selected')) {
        var selectedEraIndex = checkFocusBottomup($('span.eraloc'));
        if (selectedEraIndex > -1) {
            var selectedEra = $('ul.era').eq(selectedEraIndex);
            selectSection(selectedEra);
        };
    };
}

$(document).ready(function() {
    $(".section").click(sectionClickHandler);

    topdown_focus_bar = 100;
    bottomup_focus_bar = $(window).height() * (1 - 0.5);
    toc_height = $('#toc').height();
    preset_height = parseInt($('#history-detail-container').css('height'), 10);
    var original_width = $('#toc').css("width"); // get toc width
    var toc_offset_top = $('#toc').offset().top; // get toc current v position
    var toc_offset_left = $('#toc').offset().left; // get toc current h pos
    var original_position = $('#toc').css("position"); // get toc original position method: fixed or static, etc.

    var toc_stick = function() {
        var scroll_top = $(window).scrollTop(); // our current vertical position from the top
        var toc_top = $('#toc').offset().top; // v pos of toc
        var container_left = $('#container').offset().left;

        if (scroll_top > 866) {
            $('#toc').css({
                'position': 'fixed',
                'left': container_left + $('#real-content').width(),
                'top': -100
            });
        } else {
            $('#toc').css({
                'position': original_position,
                'left': toc_offset_left
            });
        }
    }

    // run the positioning method when the page is loaded
    toc_stick();

    var lastScrollTop = 0, delta = 5;
    $(window).scroll(function() {
        toc_stick();
        var st = $(this).scrollTop();
        if(Math.abs(lastScrollTop - st) <= delta)
           return;

        if (st > lastScrollTop){
            // downscroll code
            scrollDown();
        } else {
            // upscroll code
            scrollUp();
        }
        lastScrollTop = st;
    });
    $(window).resize(function() {
        toc_stick();
    });
});

