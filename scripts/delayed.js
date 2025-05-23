import { div, script } from './dom-helpers.js';

// add delayed functionality here
function loadKlaviyoScript() {
  document.body.append(script({
    src: 'https://static.klaviyo.com/onsite/js/RvcFeD/klaviyo.js',
    type: 'text/javascript',
    async: true,
  }));
}

function loadGoogleMap() {
  // <script src="" async defer></script>
  document.body.append(script({
    src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD_CSl9tUv71PKo67pYZuldmv-_SBhgzcI&libraries=places,marker&v=beta',
    type: 'text/javascript',
    async: true,
    defer: true,
  }));
}

function loadRecaptcha() {
  document.body.append(script({
    src: 'https://www.google.com/recaptcha/api.js?render=6LdBs2QqAAAAAC2qra4j8xTtB99OPgGVQvbHfagq',
    type: 'text/javascript',
    async: true,
  }));
}
function handlerRecaptcha() {
  // How this code snippet works:
  // This logic overwrites the default behavior of `grecaptcha.ready()` to
  // ensure that it can be safely called at any time. When `grecaptcha.ready()`
  // is called before reCAPTCHA is loaded, the callback function that is passed
  // by `grecaptcha.ready()` is enqueued for execution after reCAPTCHA is
  // loaded.
  let { grecaptcha } = window;
  if (typeof grecaptcha === 'undefined') {
    grecaptcha = {}; // eslint-disable-line
  }
  grecaptcha.ready = function (cb) { // eslint-disable-line
    if (typeof grecaptcha === 'undefined') {
      // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA's
      // configuration. By default, any functions listed in its 'fns' property
      // are automatically executed when reCAPTCHA loads.
      const c = '___grecaptcha_cfg';
      window[c] = window[c] || {};
      (window[c].fns = window[c].fns || []).push(cb);
    } else {
      cb();
    }
  };
}

function loadToasterDOM() {
  const divEl = div();
  divEl.innerHTML = `<div class="toast-message dsp-n">
  <div class="toast-message__card">
      <p class="toast-message__icon"></p>
      <p class="toast-message__content">A customer with the same email address already exists in an associated website.</p>
      <button class="toast-message__close-btn" type="button"><img class="toast-message__close-icon" src="/content/dam/arb/icons/black-cross-icon.svg"
          alt=""></button>
  </div>
</div>`;
  document.querySelector('main').append(divEl);
}
loadKlaviyoScript();
loadGoogleMap();
loadRecaptcha();
handlerRecaptcha();
loadToasterDOM();
