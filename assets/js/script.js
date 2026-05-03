(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ScrollToTop = /*#__PURE__*/function () {
  function ScrollToTop() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, ScrollToTop);
    this.root = options.root || document.body;
    this.threshold = options.threshold || 200;
    this.button = null;
    this.progressCircle = null;
    this.circumference = 0;
    this.ticking = false;
    this.onScroll = this.requestTick.bind(this);
    this.onResize = this.requestTick.bind(this);
    this.onClick = this.scrollToTop.bind(this);
  }
  return _createClass(ScrollToTop, [{
    key: "init",
    value: function init() {
      if (!this.root) return;
      if (this.button) return;
      this.createButton();
      this.setupRing();
      window.addEventListener('scroll', this.onScroll, {
        passive: true
      });
      window.addEventListener('resize', this.onResize);
      this.button.addEventListener('click', this.onClick);
      this.update();
    }
  }, {
    key: "createButton",
    value: function createButton() {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'spc-scroll-top';
      button.setAttribute('aria-label', 'Scroll to top');
      button.innerHTML = ['<svg class="spc-scroll-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">', '  <circle class="spc-scroll-top__ring-track" cx="24" cy="24" r="20"></circle>', '  <circle class="spc-scroll-top__ring-progress" cx="24" cy="24" r="20"></circle>', '</svg>', '<svg class="spc-scroll-top__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">', '  <path d="M10 4 L4 10 H8 V16 H12 V10 H16 Z"></path>', '</svg>'].join('');
      this.root.appendChild(button);
      this.button = button;
      this.progressCircle = button.querySelector('.spc-scroll-top__ring-progress');
    }
  }, {
    key: "setupRing",
    value: function setupRing() {
      if (!this.progressCircle) return;
      var radius = Number(this.progressCircle.getAttribute('r'));
      this.circumference = 2 * Math.PI * radius;
      this.progressCircle.style.strokeDasharray = "".concat(this.circumference);
      this.progressCircle.style.strokeDashoffset = "".concat(this.circumference);
    }
  }, {
    key: "requestTick",
    value: function requestTick() {
      var _this = this;
      if (this.ticking) return;
      this.ticking = true;
      window.requestAnimationFrame(function () {
        _this.update();
        _this.ticking = false;
      });
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.button || !this.progressCircle) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var progress = 0;
      if (maxScroll > 0) {
        progress = scrollTop / maxScroll;
      }
      progress = Math.max(0, Math.min(progress, 1));
      var dashOffset = this.circumference * (1 - progress);
      this.progressCircle.style.strokeDashoffset = "".concat(dashOffset);
      if (scrollTop > this.threshold) {
        this.button.classList.add('is-visible');
      } else {
        this.button.classList.remove('is-visible');
      }
    }
  }, {
    key: "scrollToTop",
    value: function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this.button) return;
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      this.button.removeEventListener('click', this.onClick);
      this.button.remove();
      this.button = null;
      this.progressCircle = null;
    }
  }]);
}();
var _default = exports["default"] = ScrollToTop;

},{}],2:[function(require,module,exports){
"use strict";

var _ScrollToTop = _interopRequireDefault(require("./classes/ScrollToTop"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('.spc-x');
  if (!root) return;
  var scrollToTop = new _ScrollToTop["default"]({
    root: root,
    threshold: 200
  });
  scrollToTop.init();

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
  var DESKTOP_POSTER = 'assets/media/hero-background-poster.webp';
  var MOBILE_POSTER = 'assets/media/hero-background-poster-mobile.webp';
  if (video && source) {
    var viewportQuery = window.matchMedia('(max-width: 920px)');
    var setSourceForViewport = function setSourceForViewport(isMobile) {
      var newSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;
      var newPoster = isMobile ? MOBILE_POSTER : DESKTOP_POSTER;

      // Set a matching poster for each viewport to minimize visual jump before playback starts.
      if (newPoster && !newPoster.includes('REPLACE_') && video.getAttribute('poster') !== newPoster) {
        video.setAttribute('poster', newPoster);
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
    setSourceForViewport(viewportQuery.matches);
    var onViewportChange = function onViewportChange(event) {
      setSourceForViewport(event.matches);
    };
    if (viewportQuery.addEventListener) {
      viewportQuery.addEventListener('change', onViewportChange);
    } else if (viewportQuery.addListener) {
      viewportQuery.addListener(onViewportChange);
    }
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

},{"./classes/ScrollToTop":1}]},{},[2])

