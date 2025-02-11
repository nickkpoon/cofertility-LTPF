
$(document).ready(function () {
    /* ------ Custom Code for Testimonial Slider 2 ------ */
    /*  Left/Right Arrow Styling  */
    function leftArrowHide() {
        $("#left-arrow").removeClass('arrow-box').addClass('arrow-end');
    }

    function leftArrowShow() {
        $("#left-arrow").removeClass('arrow-end').addClass('arrow-box');
    }

    function rightArrowHide() {
        $("#right-arrow").removeClass('arrow-box').addClass('arrow-end');
    }

    function rightArrowShow() {
        $("#right-arrow").removeClass('arrow-end').addClass('arrow-box');
    }
    /*  Hide the CMS nav dots used for styling and set the arrows to default styles for Slide 1  */
    $('.navdot').hide();
    rightArrowShow();
    leftArrowHide();

    /*  Generate nav dots for each CMS slide  */
    var slideval = 0;
    var cmscount = $("#slides").children().length;
    var countconverted = (cmscount - 1) * -100;
    for (i = 0; i < cmscount; i++) {
        var container = document.getElementById('#nav');
        var div = document.createElement("div");
        div.className = 'navdot';
        div.id = 'slide' + i;
        div.className += ' generated';
        var slidenumber = document.createElement("div");
        slidenumber.innerHTML = i + 1;
        slidenumber.className = 'navdot-number';
        div.append(slidenumber);
        document.getElementById('nav').append(div);
    }

    /*  Activate the generated nav dot for Slide 1. */
    $("#slide0").addClass("selected");

    /*  Click detection for nav dots. Activate the corresponding slide
    and update the left/right arrows if on the first or last slide  */
    $(".navdot").click(function () {
        $(".navdot").removeClass("selected");
        $(this).addClass("selected");
        var slide = $(this).attr('id');
        var num = slide.replace('slide', '');
        slide = parseInt(num);
        var multiplier = slide * -100;
        slideval = multiplier;
        if (slide == 0) {
            leftArrowHide();
            rightArrowShow();
        } else if (slide == cmscount - 1) {
            rightArrowHide();
            leftArrowShow();
        } else {
            leftArrowShow();
            rightArrowShow();
        }
        moveSlides(slideval);
        $('#animationTrigger').click();
    });

    /*  Right Arrow click detection and actions. */
    $("#right-arrow").click(function () {
        if (slideval > countconverted) {
            leftArrowShow();
            slideval += -100;
            moveSlides(slideval);
            updatenav();
            $('#animationTrigger').click();
            if (slideval == countconverted) {
                rightArrowHide();
            }
        }
    });
    /*  Left Arrow click detection and actions. */
    $("#left-arrow").click(function () {
        if (slideval < 0) {
            rightArrowShow();
            slideval += 100;
            moveSlides(slideval);
            updatenav();
            $('#animationTrigger').click();
            if (slideval == 0) {
                leftArrowHide();
            }
        }
    });
    /*  Function called on by arrow and nav dot clicks to move to
    the selected slide  */
    function moveSlides(measurement) {
        $('#slides').css({
            '-webkit-transform': 'translateX(' + slideval + '%)',
            '-moz-transform': 'translateX(' + slideval + '%)',
            '-ms-transform': 'translateX(' + slideval + '%)',
            '-o-transform': 'translateX(' + slideval + '%)',
            'transform': 'translateX(' + slideval + '%)'
        });
    }
    /*  Update nav dots so that the active dot corresponds to the
    active slide  */
    function updatenav() {
        $(".navdot").removeClass("selected");
        var slides = $('.generated');
        for (i = 0; i < slides.length; i++) {
            var slide = slides[i].id;
            var num = slide.replace('slide', '');
            slide = parseInt(num);
            var multiplier = slide * -100;
            if (multiplier == slideval) {
                $("#slide" + i).addClass("selected");
            }
        }
    }

    /* Generate page numbers dynamically for Testimonial Slider 2 */
    // Find all page number elements
    const pageNumberElements = $('.page-number-t7-copy');
    // Find total slides
    const totalSlides = $('.collection-item-9').length;
    // Update each page number
    pageNumberElements.each(function (index) {
        const oldText = $(this).text();
        const newText = `${index + 1}/${totalSlides}`;
        $(this).text(newText);
    });

    // Log final state
    pageNumberElements.each(function (index) {
    });

    /* Autoplay functionality for Testimonial Slider 2 */

    // Add auto-click functionality

    function autoClick() {
        // Only click if we haven't reached the end (slideval > countconverted)
        if (slideval > countconverted) {
            $("#right-arrow").click();
        } else {
            // Reset to first slide
            $(".navdot").removeClass("selected");
            $("#slide0").addClass("selected");
            slideval = 0;
            moveSlides(slideval);
            leftArrowHide();
            rightArrowShow();
            $('#animationTrigger').click();
        }
    }

// Start the interval
    const autoClickInterval = setInterval(autoClick, 10000);
});
