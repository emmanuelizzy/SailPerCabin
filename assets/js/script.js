(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('.spc-x');
  if (!root) return;

  // =========================================================
  // Add body class for WordPress header overlay styling
  // =========================================================
  document.body.classList.add('spc-page-overlay-header');

  // =========================================================
  // Mobile video source swap (9:16 vs 16:9)
  // =========================================================
  var video = root.querySelector('.hero-bg video');
  var source = video ? video.querySelector('source') : null;
  var DESKTOP_VIDEO = 'assets/media/vid/hero-background.mp4';
  var MOBILE_VIDEO = 'assets/media/vid/hero-background-mobile.mp4';
  var MOBILE_POSTER = 'assets/media/hero-background-poster.webp';
  if (video && source) {
    var setSourceForViewport = function setSourceForViewport() {
      var isMobile = window.innerWidth <= 920;
      var newSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

      // Set mobile poster if available (not placeholder)
      if (isMobile && MOBILE_POSTER && !MOBILE_POSTER.includes('REPLACE_')) {
        video.setAttribute('poster', MOBILE_POSTER);
      }

      // Skip if mobile URL is still placeholder
      if (newSrc.includes('REPLACE_')) return;

      // Swap source if changed
      if (source.getAttribute('src') !== newSrc) {
        source.setAttribute('src', newSrc);
        video.load();
        var playPromise = video.play();
        if (playPromise && playPromise["catch"]) {
          playPromise["catch"](function () {});
        }
      }
    };
    setSourceForViewport();
  }

  // =========================================================
  // Intersection Observer for reveal animations
  // =========================================================
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    // Elements that should reveal on scroll
    root.querySelectorAll('.day, .section-head, .whatis .grid, .included-grid, .fit-grid, .hero-meta').forEach(function (el) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  // =========================================================
  // Video controls killswitch
  // Strips native controls via event listeners and polling
  // =========================================================
  if (video) {
    var killControls = function killControls() {
      video.removeAttribute('controls');
      video.controls = false;
      video.setAttribute('tabindex', '-1');
    };
    killControls();

    // Kill controls on every state change
    var events = ['loadedmetadata', 'loadeddata', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'canplaythrough', 'suspend'];
    events.forEach(function (evt) {
      video.addEventListener(evt, killControls);
    });

    // Polling fallback (20 checks at 250ms intervals = 5s total)
    var checkCount = 0;
    var pollInterval = setInterval(function () {
      killControls();
      checkCount++;
      if (checkCount > 20) clearInterval(pollInterval);
    }, 250);
  }
});

},{}]},{},[1])

