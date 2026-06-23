/*
 * Start a project — site-wide modal contact form.
 *
 * Self-contained: injects its own styles + markup, then wires every
 * "Start a project" link/button on the page to open the modal.
 * Submits to info@gaiaapp.net via Formsubmit and shows a success dialog.
 *
 * Drop into any page with:  <script src="/assets/start-a-project.js" defer></script>
 * No markup changes required — triggers are matched by their button text.
 */
(function () {
  if (window.__sapInit) return;
  window.__sapInit = true;

  // ---- EmailJS: brand-styled HTML notification -------------------------------
  // Paste the SAME three values here AND in fit-check/index.html to switch the
  // enquiry email from Formsubmit's plain table to a brand-styled HTML email.
  // The public key is safe to expose client-side. Until all three are filled,
  // enquiries keep going to info@gaiaapp.net via Formsubmit exactly as before.
  // EmailJS template must use: To Email = {{to_email}}, Subject = {{subject}},
  // content = a code block containing {{{content}}} (triple braces = raw HTML).
  var EMAILJS_PUBLIC_KEY  = 'ATIF7N2FVkzlDM9Tv';
  var EMAILJS_SERVICE_ID  = 'service_zpnv5be';
  var EMAILJS_TEMPLATE_ID = 'template_kn92476';
  var emailjsConfigured = !!(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID);

  function ensureEmailjs() {
    if (!emailjsConfigured || window.emailjs) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = function () { try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) {} };
    document.head.appendChild(s);
  }
  function emailjsReady() { return emailjsConfigured && !!window.emailjs; }

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }
  function enquiryRow(label, valueHtml) {
    return '<tr>' +
      '<td style="padding:14px 0;border-bottom:1px solid #EAE3F2;font-size:13px;line-height:1.5;color:#6A5B7A;width:34%;vertical-align:top;">' + label + '</td>' +
      '<td style="padding:14px 0;border-bottom:1px solid #EAE3F2;font-size:15px;line-height:1.5;color:#180026;vertical-align:top;">' + valueHtml + '</td>' +
    '</tr>';
  }
  function buildEnquiryHtml(d) {
    var rows =
      enquiryRow('Name', escHtml(d.name)) +
      enquiryRow('Email', '<a href="mailto:' + escHtml(d.email) + '" style="color:#7548FF;text-decoration:underline;">' + escHtml(d.email) + '</a>') +
      enquiryRow('Mobile', escHtml(d.mobile)) +
      enquiryRow('Company', escHtml(d.company)) +
      enquiryRow('Location', escHtml(d.location)) +
      enquiryRow('Subject', escHtml(d.subject)) +
      enquiryRow('Message', escHtml(d.message).replace(/\n/g, '<br>'));
    return '' +
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:8px;color:#180026;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border:1px solid #EAE3F2;border-radius:24px;overflow:hidden;">' +
          '<tr><td style="background:#180026;padding:22px 28px;">' +
            '<div style="font-size:18px;font-weight:700;color:#ffffff;line-height:1.2;">New project enquiry</div>' +
            '<div style="font-size:13px;color:#C9BEDA;margin-top:3px;">via lifeandpassing.com</div>' +
          '</td></tr>' +
          '<tr><td style="padding:4px 28px 22px;background:#ffffff;">' +
            '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rows + '</table>' +
          '</td></tr>' +
        '</table>' +
        '<p style="font-size:13px;line-height:1.6;color:#807388;margin:20px 0 0;text-align:center;">Life and Passing Digital</p>' +
      '</div>';
  }

  var STYLE = [
    '.sap-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;font-family:"Uncut Sans","Inter",ui-sans-serif,system-ui,sans-serif;}',
    '.sap-modal[hidden]{display:none;}',
    '.sap-scrim{position:absolute;inset:0;background:rgba(0,0,0,.5);}',
    '.sap-dialog{position:relative;z-index:1;background:#fff;width:840px;max-width:100%;max-height:calc(100vh - 40px);overflow-y:auto;border-radius:40px;box-shadow:0 24px 19px rgba(0,0,0,.14),0 9px 23px rgba(0,0,0,.12),0 11px 7.5px rgba(0,0,0,.2);animation:sap-in .3s cubic-bezier(.16,1,.3,1) both;}',
    '.sap-dialog--sm{width:480px;}',
    '.sap-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:32px 40px 0;}',
    '.sap-title{font-weight:700;font-size:32px;line-height:1.15;letter-spacing:-.01em;color:#180026;margin:0;}',
    '.sap-close{flex:0 0 auto;width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:#EFEDF0;color:#180026;cursor:pointer;transition:background .2s;}',
    '.sap-close:hover{background:#e2dee6;}',
    '.sap-close:focus-visible{outline:2px solid #7548FF;outline-offset:2px;}',
    '.sap-body{padding:24px 40px;}',
    '.sap-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;}',
    '.sap-field{display:flex;flex-direction:column;gap:8px;min-width:0;}',
    '.sap-field--full{grid-column:1 / -1;}',
    '.sap-field label{font-weight:600;font-size:12px;line-height:1.64;color:#180026;}',
    '.sap-field input,.sap-field select,.sap-field textarea{font-family:inherit;font-weight:400;font-size:16px;line-height:1.5;color:#180026;background:#fff;border:1px solid #C0BAC4;border-radius:12px;padding:16px;width:100%;box-sizing:border-box;transition:border-color .2s;-webkit-appearance:none;appearance:none;}',
    '.sap-field textarea{resize:vertical;min-height:116px;}',
    '.sap-field input::placeholder,.sap-field textarea::placeholder{color:#807388;}',
    '.sap-field input:focus,.sap-field select:focus,.sap-field textarea:focus{outline:none;border-color:#7548FF;}',
    '.sap-select-wrap{position:relative;}',
    '.sap-chevron{position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none;color:#180026;}',
    '.sap-select{padding-right:44px;cursor:pointer;}',
    '.sap-select.sap-placeholder{color:#807388;}',
    '.sap-field.sap-invalid input,.sap-field.sap-invalid select,.sap-field.sap-invalid textarea{border-color:#DA1710;}',
    '.sap-error{display:none;font-size:13px;line-height:1.4;color:#DA1710;margin-top:2px;}',
    '.sap-field.sap-invalid .sap-error{display:block;}',
    '.sap-cta{display:flex;justify-content:flex-end;padding:24px 0 16px;}',
    '.sap-send{font-family:inherit;font-weight:600;font-size:16px;line-height:1;color:#fff;background:#180026;border:none;border-radius:999px;padding:14px 28px;min-height:48px;cursor:pointer;transition:transform .25s,box-shadow .25s;}',
    '.sap-send:hover{transform:translateY(-1px);box-shadow:0 14px 34px -14px rgba(24,0,38,.6);}',
    '.sap-send:disabled{opacity:.6;cursor:default;transform:none;}',
    '.sap-send:focus-visible{outline:2px solid #7548FF;outline-offset:2px;}',
    '.sap-head--sm{padding:32px 32px 0;}',
    '.sap-title--sm{font-size:24px;}',
    '.sap-success-body{padding:12px 32px 0;}',
    '.sap-success-body p{font-weight:400;font-size:18px;line-height:1.6;color:#463351;margin:0;}',
    '.sap-success .sap-cta{padding:24px 32px 32px;}',
    '.sap-ok{font-family:inherit;font-weight:600;font-size:16px;line-height:1;color:#fff;background:#180026;border:1.5px solid #180026;border-radius:999px;padding:12px 24px;min-height:44px;cursor:pointer;transition:transform .25s,box-shadow .25s;}',
    '.sap-ok:hover{transform:translateY(-1px);box-shadow:0 14px 34px -14px rgba(24,0,38,.6);}',
    '.sap-ok:focus-visible{outline:2px solid #7548FF;outline-offset:2px;}',
    '@keyframes sap-in{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}',
    '@media (prefers-reduced-motion:reduce){.sap-dialog{animation:none;}}',
    '@media (max-width:640px){',
    '.sap-modal{padding:16px;align-items:flex-start;}',
    '.sap-dialog{width:100%;max-width:none;border-radius:24px;max-height:calc(100vh - 32px);}',
    '.sap-dialog--sm{width:100%;}',
    '.sap-head{padding:24px 24px 0;}',
    '.sap-title{font-size:26px;}',
    '.sap-body{padding:20px 24px;}',
    '.sap-grid{grid-template-columns:1fr;gap:18px;}',
    '.sap-cta{padding:24px 0 8px;}',
    '.sap-head--sm{padding:24px 24px 0;}',
    '.sap-success-body{padding:12px 24px 0;}',
    '.sap-success .sap-cta{padding:20px 24px 24px;}',
    '}'
  ].join('');

  var CLOSE_ICON =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M1 1 13 13M13 1 1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  var CHEVRON_SVG =
    '<svg class="sap-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
    '<path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var HTML =
    '<div class="sap-modal" id="sapModal" role="dialog" aria-modal="true" aria-labelledby="sapTitle" hidden>' +
      '<div class="sap-scrim" data-close></div>' +
      '<div class="sap-dialog">' +
        '<div class="sap-head">' +
          '<h2 class="sap-title" id="sapTitle">Start a project</h2>' +
          '<button type="button" class="sap-close" data-close aria-label="Close">' + CLOSE_ICON + '</button>' +
        '</div>' +
        '<form class="sap-body" id="sapForm" novalidate>' +
          '<div class="sap-grid">' +
            '<div class="sap-field">' +
              '<label for="sapName">Name</label>' +
              '<input type="text" id="sapName" name="name" placeholder="e.g. John Doe" autocomplete="name" aria-describedby="sapNameErr" />' +
              '<span class="sap-error" id="sapNameErr" role="alert"></span>' +
            '</div>' +
            '<div class="sap-field">' +
              '<label for="sapEmail">Email</label>' +
              '<input type="email" id="sapEmail" name="email" placeholder="e.g. john@company.com" autocomplete="email" inputmode="email" aria-describedby="sapEmailErr" />' +
              '<span class="sap-error" id="sapEmailErr" role="alert"></span>' +
            '</div>' +
            '<div class="sap-field">' +
              '<label for="sapMobile">Mobile</label>' +
              '<input type="tel" id="sapMobile" name="mobile" placeholder="e.g. 0412 345 678" autocomplete="tel" inputmode="tel" aria-describedby="sapMobileErr" />' +
              '<span class="sap-error" id="sapMobileErr" role="alert"></span>' +
            '</div>' +
            '<div class="sap-field">' +
              '<label for="sapCompany">Company</label>' +
              '<input type="text" id="sapCompany" name="company" placeholder="e.g. Company Pty Ltd" autocomplete="organization" />' +
            '</div>' +
            '<div class="sap-field">' +
              '<label for="sapLocation">Location</label>' +
              '<input type="text" id="sapLocation" name="location" placeholder="e.g. Sydney" />' +
            '</div>' +
            '<div class="sap-field">' +
              '<label for="sapSubject">Subject</label>' +
              '<div class="sap-select-wrap">' +
                '<select class="sap-select sap-placeholder" id="sapSubject" name="subject">' +
                  '<option value="" disabled selected>Select an option</option>' +
                  '<option>Product strategy</option>' +
                  '<option>Design</option>' +
                  '<option>Engineering</option>' +
                  '<option>AI &amp; data</option>' +
                  '<option>Growth</option>' +
                  '<option>Other</option>' +
                '</select>' +
                CHEVRON_SVG +
              '</div>' +
            '</div>' +
            '<div class="sap-field sap-field--full">' +
              '<label for="sapMessage">Tell us about your project(s)</label>' +
              '<textarea id="sapMessage" name="message" rows="4" placeholder="Any information you share will not be shared per our privacy policy"></textarea>' +
            '</div>' +
          '</div>' +
          '<div class="sap-cta"><button type="submit" class="sap-send">Submit enquiry</button></div>' +
        '</form>' +
      '</div>' +
    '</div>' +
    '<div class="sap-modal sap-success" id="sapSuccess" role="dialog" aria-modal="true" aria-labelledby="sapSuccessTitle" hidden>' +
      '<div class="sap-scrim" data-close></div>' +
      '<div class="sap-dialog sap-dialog--sm">' +
        '<div class="sap-head sap-head--sm"><h2 class="sap-title sap-title--sm" id="sapSuccessTitle">Message sent</h2></div>' +
        '<div class="sap-success-body"><p>Thank you for submitting your project enquiry. A member of our team will be in touch with you shortly via email or call.</p></div>' +
        '<div class="sap-cta"><button type="button" class="sap-ok" id="sapOk">OK, got it</button></div>' +
      '</div>' +
    '</div>';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+]?[\d\s().-]{7,}$/;

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function digitCount(s) { return (s.match(/\d/g) || []).length; }

  function init() {
    var style = document.createElement('style');
    style.id = 'sap-styles';
    style.textContent = STYLE;
    document.head.appendChild(style);
    ensureEmailjs();

    var holder = document.createElement('div');
    holder.innerHTML = HTML;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    var modal = document.getElementById('sapModal');
    var success = document.getElementById('sapSuccess');
    var form = document.getElementById('sapForm');
    var subjectEl = document.getElementById('sapSubject');
    var sendBtn = form.querySelector('.sap-send');
    var lastFocus = null;

    var fields = {
      name: { input: document.getElementById('sapName'), err: document.getElementById('sapNameErr') },
      email: { input: document.getElementById('sapEmail'), err: document.getElementById('sapEmailErr') },
      mobile: { input: document.getElementById('sapMobile'), err: document.getElementById('sapMobileErr') }
    };

    // ---- focus + scroll helpers ----
    function focusablesIn(c) {
      var sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
      return Array.prototype.slice.call(c.querySelectorAll(sel)).filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
    }
    function trap(e, c) {
      var f = focusablesIn(c);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    function restoreFocus() { if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} } }

    function onKey(e) { if (e.key === 'Escape') dismiss(); else if (e.key === 'Tab') trap(e, modal); }
    function onKeySuccess(e) { if (e.key === 'Escape') closeSuccess(); else if (e.key === 'Tab') trap(e, success); }

    // ---- open / cancel / success ----
    function open() {
      lastFocus = document.activeElement;
      document.body.classList.remove('menu-open'); // close the homepage mobile menu if it triggered us
      var mb = document.getElementById('menuBtn');
      if (mb) mb.setAttribute('aria-expanded', 'false');
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      setTimeout(function () { fields.name.input.focus(); }, 0);
    }
    function dismiss() { // cancel — keep entered values so the user can resume
      modal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      restoreFocus();
    }
    function toSuccess() { // submitted OK — clear the form, swap to the success dialog
      modal.hidden = true;
      document.removeEventListener('keydown', onKey);
      form.reset();
      clearAllErrors();
      subjectEl.classList.add('sap-placeholder');
      success.hidden = false;
      document.addEventListener('keydown', onKeySuccess);
      setTimeout(function () { document.getElementById('sapOk').focus(); }, 0);
    }
    function closeSuccess() {
      success.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeySuccess);
      restoreFocus();
    }

    // ---- validation ----
    function setError(key, msg) {
      var f = fields[key];
      f.input.parentNode.classList.add('sap-invalid');
      f.input.setAttribute('aria-invalid', 'true');
      f.err.textContent = msg;
    }
    function clearError(key) {
      var f = fields[key];
      f.input.parentNode.classList.remove('sap-invalid');
      f.input.removeAttribute('aria-invalid');
      f.err.textContent = '';
    }
    function clearAllErrors() { clearError('name'); clearError('email'); clearError('mobile'); }

    function validate() {
      clearAllErrors();
      var ok = true;
      var firstBad = null;
      var name = fields.name.input.value.trim();
      var email = fields.email.input.value.trim();
      var mobile = fields.mobile.input.value.trim();
      if (!name) { setError('name', 'Please enter your name.'); ok = false; firstBad = firstBad || fields.name.input; }
      if (!email) { setError('email', 'Please enter your email address.'); ok = false; firstBad = firstBad || fields.email.input; }
      else if (!EMAIL_RE.test(email)) { setError('email', 'Please enter a valid email address.'); ok = false; firstBad = firstBad || fields.email.input; }
      if (mobile && (!PHONE_RE.test(mobile) || digitCount(mobile) < 7)) { setError('mobile', 'Please enter a valid mobile number.'); ok = false; firstBad = firstBad || fields.mobile.input; }
      if (firstBad) firstBad.focus();
      return ok;
    }

    // clear a field's error as soon as the user edits it
    ['name', 'email', 'mobile'].forEach(function (key) {
      fields[key].input.addEventListener('input', function () { clearError(key); });
    });
    subjectEl.addEventListener('change', function () {
      if (subjectEl.value) subjectEl.classList.remove('sap-placeholder');
      else subjectEl.classList.add('sap-placeholder');
    });

    // ---- submit ----
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var label = sendBtn.textContent;
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';

      var name = fields.name.input.value.trim();
      var email = fields.email.input.value.trim();
      var company = document.getElementById('sapCompany').value.trim();
      var data = {
        name: name,
        email: email,
        mobile: fields.mobile.input.value.trim() || '—',
        company: company || '—',
        location: document.getElementById('sapLocation').value.trim() || '—',
        subject: subjectEl.value || '—',
        message: document.getElementById('sapMessage').value.trim() || '—'
      };
      var subjectLine = 'New project enquiry — ' + (company || name || email);

      function viaFormsubmit() {
        return fetch('https://formsubmit.co/ajax/info@gaiaapp.net', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: data.name, email: data.email, mobile: data.mobile,
            company: data.company, location: data.location,
            subject: data.subject, message: data.message,
            _subject: subjectLine, _captcha: 'false', _template: 'table'
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('Bad status ' + res.status);
          return res.json();
        });
      }

      // Prefer the brand-styled EmailJS email; fall back to Formsubmit so a
      // lead is never lost if EmailJS is unset or errors at send time.
      var send;
      if (emailjsReady()) {
        send = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: 'info@gaiaapp.net',
          subject: subjectLine,
          content: buildEnquiryHtml(data)
        }).catch(function () { return viaFormsubmit(); });
      } else {
        send = viaFormsubmit();
      }

      send.then(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = label;
        toSuccess();
      }).catch(function () {
        sendBtn.disabled = false;
        sendBtn.textContent = label;
        alert('Something went wrong — please try again, or email us directly at info@gaiaapp.net.');
      });
    });

    // ---- wiring ----
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', dismiss);
    });
    success.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeSuccess);
    });
    document.getElementById('sapOk').addEventListener('click', closeSuccess);

    // Every "Start a project" link/button on the page opens the modal.
    var triggers = Array.prototype.slice.call(document.querySelectorAll('a, button')).filter(function (el) {
      if (el.closest('#sapModal') || el.closest('#sapSuccess')) return false;
      return norm(el.textContent) === 'start a project';
    });
    triggers.forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
