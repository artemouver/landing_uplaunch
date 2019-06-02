import $ from 'jquery';
import skrollr from 'skrollr';
import './lib/jquery.appear.js';
// START OF: if mobile =====
const isMobile = (function() {
  function check() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
  }
  return {
    check: check
  };
}());
// ===== END OF: if mobile


// START OF: mark OSX =====
const isApple = !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
document.body.className += isApple ? ' body--apple' : ' body--not-apple';
// ===== END OF: mark OSX

// START OF: feedback slider =====
const feedbackSlider = (function() {
  let interval, timeout;

  function start() {
    const $current = $('.state-active.js-feedback-item');
    let $next = $current.next();
    if(!$next.hasClass('js-feedback-item')) {
      $next = $('.js-feedback-item:first-child');
    }

    $current.removeClass('state-active');
    $next.addClass('state-active');
    const newIndex = $next.attr('data-index');
    $('.state-loading-dot').removeClass('state-loading-dot');
    $('.js-feedback-dot[data-index="' + newIndex + '"]').addClass('state-loading-dot');
  }
  function bindClick() {
    $(document).on('click', '.js-feedback-dot', function(event) {
      event.preventDefault();
      const $current = $('.state-active.js-feedback-item');
      $current.removeClass('state-active');
      $('.state-loading-dot').removeClass('state-loading-dot');
      $('.state-active-dot').removeClass('state-active-dot');

      const newIndex = $(this).attr('data-index');

      $('.js-feedback-item[data-index="' + newIndex + '"]').addClass('state-active');
      $('.js-feedback-dot[data-index="' + newIndex + '"]').addClass('state-active-dot');

      clearInterval(interval);
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        $('.js-feedback-dot[data-index="' + newIndex + '"]').removeClass('state-active-dot');
        start();
        interval = setInterval(start, 5000);
      }, 10000);
    });

  }

  function init() {
    $('.js-feedback-dot[data-index="' + 1 + '"]').addClass('state-loading-dot');
    start();
    interval = setInterval(start, 5000);
    bindClick();
  }
  return {
    init: init
  };
}());
feedbackSlider.init();
// ===== END OF: feedback slider

// START OF: coverSectionAnimation =====
const coverSectionAnimation = (function() {
  function bindPlaceholder() {
    $(document).on('click', '.js-sketchy-form-button', function(event) {
      event.preventDefault();
      const min = 20, max = 80;
      const randomWidth = Math.floor(Math.random() * (max - min)) + min;

      $('.js-sketchy-placeholder').css('transform', 'scaleX(' + randomWidth/100 + ')');

    });
  }

  function startRotation() {
    $('.cover').addClass('state-rotating');
    const numCards = $('.cover__small_card_box:first').children().length;
    let cards = [];
    for (let i = 1; i <= numCards; i++)
      cards.push($(`.cover__small_card--${i}`));
    for (let i = 1; i <= numCards; i++) {
      cards[i-1]
        .removeClass(`cover__small_card--${i}`)
        .addClass(`cover__small_card--${i === 1 ? numCards : i - 1}`);
    }
    setTimeout(function() {
      startRotation();
    }, 2000);
  }

  function init() {
    bindPlaceholder();
    setTimeout(function() {
      startRotation();
    }, 3500);
    setTimeout(function() {
      $('.cover').addClass('state-appear');
      $('.cover .js-appearing-content').addClass('appeared-content');
    }, 100);
  }
  return {
    init: init
  };
}());

coverSectionAnimation.init();
// ===== END OF: coverSectionAnimation


// START OF: designSectionAnimation =====
const designSectionAnimation = (function() {
  function startRotation() {
    $('.design').addClass('state-rotating');
    const top = $('.state-top');
    const mid = $('.state-mid');
    const back = $('.state-back');
    const topClone = top.clone().removeClass('state-top').addClass('to-show').appendTo('.design__cards_box');
    setTimeout(function() {
      top.removeClass('state-top').addClass('to-hidden');
      mid.removeClass('state-mid').addClass('state-top');
      back.removeClass('state-back').addClass('state-mid');
      topClone.removeClass('to-show').addClass('state-back');
    }, 100);

    setTimeout(function() {
      $('.to-hidden').remove();
      startRotation();
    }, 3900);
  }

  function init() {
    setTimeout(function() {
      startRotation();
    }, 1500);
  }
  return {
    init: init
  };
}());
// ===== END OF: designSectionAnimation

// START OF: content appearing =====
const contentAppearing = (function() {
  const bind = function() {
    const skrollrInstance = skrollr.init();

    const $content= $('.js-appearing-content');
    $content.appear();

    let settings = {
      permanent: ['design__cards_box', 'code__cards_box', 'prototype__mockup_box'],
      offset: {
        'design__cards_box': {
          top: function(height) { return -0.1 * height; },
          bottom: function(height) { return -0.1 * height; }
        },
        'code__features__line': {
          top: function(height) { return -0.7 * height; },
          bottom: function(height) { return -0.7 * height; }
        },
        'prototype__features__line': {
          top: function(height) { return -0.7 * height; },
          bottom: function(height) { return -0.7 * height; }
        },
        'features__row': {
          top: function(height) { return -0.7 * height; },
          bottom: function(height) { return -0.7 * height; }
        }
      },
      init: {
        'design__cards_box': designSectionAnimation.init
      },
      connect: {
        'code__cards_box': 'code__circle',
        'prototype__mockup_box': 'prototype__logo_box'
      },
      connectState: {
        'features__title': 'features__box',
        'features__row': 'features__box'
      },
      css: {
        'code__cards_box': {
          'code__card--top': {
            'transition-delay': '0s'
          }
        }
      },
      attr: {
        'code__cards_box': {
          'code__card--top': {
            'data-bottom-top': 'transform: translateY(0%);'
          },
          'code__card--bottom': {
            'data-bottom-top': 'transform: translateY(0%);'
          }
        },
        'prototype__advanced_box': {
          'prototype__advanced_img:nth-child(1)': {
            'data-bottom-top': 'transform: translateY(25%);'
          },
          'prototype__advanced_img:nth-child(2)': {
            'data-bottom-top': 'transform: translateY(-25%);'
          }
        },
        'prototype__mockup_box': {
          'prototype__mockup': {
            'data-bottom-top': 'transform: translateY(-60%);'
          }
        }
      },
      smoothHiding: ['code__features__line', 'prototype__features__line', 'features__row']
    };

    const setOffset = function() {
      for (let offset_el in settings.offset)
        for (let position in settings.offset[offset_el]) {
          const elem = $('.' + offset_el);
          elem.attr('data-appear-' + position + '-offset', settings.offset[offset_el][position](elem.innerHeight()));
        }
    };
    setOffset();

    $(document.body)
      .on('appear', '.js-appearing-content', function(e, $affected) {
        // this code is executed for each appeared element
        const elem = $(this);
        elem.addClass('appeared-content');

        for (let i = 0; i < settings.permanent.length; i++)
          if (elem.hasClass(settings.permanent[i])) {
            elem.removeClass('js-appearing-content');
          }

        for (let el in settings.init)
          if (elem.hasClass(el)) {
            settings.init[el]();
          }

        for (let el in settings.connect)
          if (elem.hasClass(el)) {
            $('.' + settings.connect[el]).addClass('appeared-content');
          }

        for (let el in settings.connectState)
          if (elem.hasClass(el)) {
            $('.' + settings.connectState[el]).addClass('state-content');
          }

        for (let el in settings.css)
          if (elem.hasClass(el))
            for (let obj in settings.css[el])
              $('.' + obj).css(settings.css[el][obj]);


        const loadAttr = function(el, attr, val) {
          if (el.attr(attr) === val) {
            skrollrInstance.refresh();
          }
          else
            setTimeout(loadAttr.bind(null, el, attr, val), 20);
        };

        for (let el in settings.attr)
          if (elem.hasClass(el))
            for (let obj in settings.attr[el]) {
              const element = $('.' + obj);
              element.attr(settings.attr[el][obj]);
              for (let property in settings.attr[el][obj])
                loadAttr(element, property, settings.attr[el][obj][property]);
            }
      })
      .on('disappear', '.js-appearing-content', function(e, $affected) {
        // this code is executed for each appeared element
        const obj = $(this);
        let smoothHiding = false;
        for (let i = 0; i < settings.smoothHiding.length; i++)
          if (obj.hasClass(settings.smoothHiding[i])) {
            smoothHiding = true;
          }

        if (!smoothHiding)
          obj.addClass('no-transition').find('*, *:before, *:after').addClass('no-transition');
        obj.removeClass('appeared-content');
        if (!smoothHiding)
          setTimeout(function() {
            obj.removeClass('no-transition').find('*, *:before, *:after').removeClass('no-transition');
          }, 50);
      });
  };
  return {
    bind: bind
  };
}());

contentAppearing.bind();
// ===== END OF: content appearing


// START OF: navigation scrolling =====
let scrollPos = $(window).scrollTop();
const navigationScrolling = (function() {
  const bind = function() {
    $(window).scroll(function(event) {
      var scrolled = $(this).scrollTop();
      let $nav = $('.nav');
      if (window.screen.width > 768)
        if (scrolled > 0)
          $nav.css({'background-color': '#fff', 'padding': '10px 0'});
        else
          $nav.css({'background-color': 'rgba(255,255,255,0)', 'padding': '40px 0'});
      else
        $nav.css({'padding': '20px 0'});

      let delta = scrolled - scrollPos;
      if (delta >= 0 && scrolled > 0) {
        $nav.css({'transform': 'translateY(-100%)'});
      } else {
        $nav.css({'transform': 'none'});
      }

      scrollPos = scrolled;
    });
  };
  return {
    bind: bind
  };
}());

navigationScrolling.bind();
// ===== END OF: navigation scrolling

$(window).on('load', function() {
  console.log('loaded landing index');
});
