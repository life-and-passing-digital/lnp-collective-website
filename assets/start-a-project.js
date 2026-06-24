/*
 * Start a project — site-wide modal contact form.
 *
 * Self-contained: injects its own styles + markup, then wires every
 * "Start a project" link/button on the page to open the modal.
 * Submits to info@gaiaapp.net via EmailJS (brand-styled) with a
 * Formsubmit fallback. Shows a success dialog on delivery.
 *
 * Drop into any page with:  <script src="/assets/start-a-project.js" defer></script>
 * No markup changes required — triggers are matched by their button text.
 */
(function () {
  if (window.__sapInit) return;
  window.__sapInit = true;

  // ---- EmailJS: brand-styled HTML notification --------------------------------
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
  function enquiryRow(label, valueHtml, last) {
    var bb = last ? '' : 'border-bottom:1px solid #EAE3F2;';
    return '<tr>' +
      '<td style="padding:14px 0;' + bb + 'font-size:13px;line-height:1.5;color:#6A5B7A;width:34%;vertical-align:top;">' + label + '</td>' +
      '<td style="padding:14px 0;' + bb + 'font-size:15px;line-height:1.5;color:#180026;vertical-align:top;">' + valueHtml + '</td>' +
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
      enquiryRow('Message', escHtml(d.message).replace(/\n/g, '<br>'), true);
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
        '<p style="font-size:13px;line-height:1.6;color:#807388;margin:20px 0 0;text-align:center;">&copy; 2026 Life And Passing Digital Pty Ltd. All rights reserved. Visit our website <a href="https://lifeandpassing.com" style="color:#7548FF;text-decoration:underline;">lifeandpassing.com</a></p>' +
      '</div>';
  }

  // ---- Subject options -------------------------------------------------------
  var SUBJECT_OPTIONS = [
    'Product strategy',
    'Design',
    'Engineering',
    'AI & data',
    'Growth',
    'Other'
  ];

  // ---- Styles ----------------------------------------------------------------
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
    '.sap-field input,.sap-field textarea{font-family:inherit;font-weight:400;font-size:16px;line-height:1.5;color:#180026;background:#fff;border:1px solid #C0BAC4;border-radius:12px;padding:16px;width:100%;box-sizing:border-box;transition:border-color .2s;-webkit-appearance:none;appearance:none;}',
    '.sap-field textarea{resize:vertical;min-height:116px;}',
    '.sap-field input::placeholder,.sap-field textarea::placeholder{color:#807388;}',
    '.sap-field input:focus,.sap-field textarea:focus{outline:none;border-color:#7548FF;}',
    /* Custom subject dropdown */
    '.sap-dd{position:relative;}',
    '.sap-dd-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;font-family:inherit;font-size:16px;font-weight:400;line-height:1.5;background:#fff;border:1px solid #C0BAC4;border-radius:12px;padding:16px;cursor:pointer;text-align:left;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}',
    '.sap-dd-label{flex:1;color:#807388;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.sap-dd-btn.sap-selected .sap-dd-label{color:#180026;}',
    '.sap-dd-btn:focus,.sap-dd-btn[aria-expanded="true"]{outline:none;border-color:#7548FF;}',
    '.sap-dd-chevron{flex-shrink:0;transition:transform .25s;color:#180026;}',
    '.sap-dd-btn[aria-expanded="true"] .sap-dd-chevron{transform:rotate(180deg);}',
    '.sap-dd-panel{position:absolute;top:calc(100% + 6px);left:0;right:0;background:#fff;border-radius:16px;box-shadow:0 2px 8px rgba(24,0,38,.06),0 8px 24px rgba(24,0,38,.10),0 4px 6px rgba(24,0,38,.04);padding:8px;z-index:200;list-style:none;margin:0;animation:sap-dd-in .18s cubic-bezier(.16,1,.3,1) both;}',
    '.sap-dd-panel[hidden]{display:none;animation:none;}',
    '.sap-dd-opt{display:block;padding:10px 16px;border-radius:8px;font-family:inherit;font-size:15px;line-height:1.5;color:#180026;cursor:pointer;outline:none;-webkit-user-select:none;user-select:none;}',
    '.sap-dd-opt:hover,.sap-dd-opt:focus{background:#F3ECFA;color:#180026;}',
    '.sap-dd-opt[aria-selected="true"]{color:#7548FF;font-weight:600;}',
    '@keyframes sap-dd-in{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:none;}}',
    /* Invalid states */
    '.sap-field.sap-invalid input,.sap-field.sap-invalid textarea{border-color:#DA1710;}',
    '.sap-field.sap-invalid .sap-dd-btn{border-color:#DA1710;}',
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
    '@media (prefers-reduced-motion:reduce){.sap-dialog{animation:none;}.sap-dd-panel{animation:none;}}',
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

  // ---- Icons -----------------------------------------------------------------
  var CLOSE_ICON =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M1 1 13 13M13 1 1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  var CHEVRON_ICON =
    '<svg class="sap-dd-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
    '<path d="M4 6 8 10 12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---- Markup ----------------------------------------------------------------
  var subjectOptsHtml = SUBJECT_OPTIONS.map(function (opt) {
    return '<li class="sap-dd-opt" role="option" aria-selected="false" tabindex="-1" data-value="' +
      opt.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">' +
      opt.replace(/&/g, '&amp;') + '</li>';
  }).join('');

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
              '<input type="tel" id="sapMobile" name="mobile" placeholder="e.g. 0412 345 678" autocomplete="tel" inputmode="tel" maxlength="12" aria-describedby="sapMobileErr" />' +
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
              '<label id="sapSubjectLbl">Subject</label>' +
              '<div class="sap-dd" id="sapSubjectWrap">' +
                '<button type="button" class="sap-dd-btn" id="sapSubjectBtn"' +
                  ' aria-haspopup="listbox" aria-expanded="false"' +
                  ' aria-controls="sapSubjectPanel" aria-labelledby="sapSubjectLbl sapSubjectVal">' +
                  '<span class="sap-dd-label" id="sapSubjectVal">Select an option</span>' +
                  CHEVRON_ICON +
                '</button>' +
                '<ul class="sap-dd-panel" id="sapSubjectPanel" role="listbox" aria-labelledby="sapSubjectLbl" hidden>' +
                  subjectOptsHtml +
                '</ul>' +
                '<input type="hidden" id="sapSubject" name="subject" value="">' +
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

    var modal     = document.getElementById('sapModal');
    var success   = document.getElementById('sapSuccess');
    var form      = document.getElementById('sapForm');
    var sendBtn   = form.querySelector('.sap-send');
    var lastFocus = null;

    var fields = {
      name:   { input: document.getElementById('sapName'),   err: document.getElementById('sapNameErr') },
      email:  { input: document.getElementById('sapEmail'),  err: document.getElementById('sapEmailErr') },
      mobile: { input: document.getElementById('sapMobile'), err: document.getElementById('sapMobileErr') }
    };

    // ---- Mobile number formatter (10 digits max → XXXX XXX XXX) ----
    fields.mobile.input.addEventListener('input', function (e) {
      var raw = e.target.value.replace(/\D/g, '').slice(0, 10);
      var fmt = raw;
      if (raw.length > 7) fmt = raw.slice(0, 4) + ' ' + raw.slice(4, 7) + ' ' + raw.slice(7);
      else if (raw.length > 4) fmt = raw.slice(0, 4) + ' ' + raw.slice(4);
      e.target.value = fmt;
      clearError('mobile');
    });

    // ---- Custom subject dropdown --------------------------------------------
    var subjectBtn   = document.getElementById('sapSubjectBtn');
    var subjectPanel = document.getElementById('sapSubjectPanel');
    var subjectVal   = document.getElementById('sapSubjectVal');
    var subjectField = document.getElementById('sapSubject');
    var subjectWrap  = document.getElementById('sapSubjectWrap');
    var opts         = Array.prototype.slice.call(subjectPanel.querySelectorAll('.sap-dd-opt'));
    var ddFocusIdx   = -1;

    function ddOpen() {
      subjectBtn.setAttribute('aria-expanded', 'true');
      subjectPanel.hidden = false;
      var selIdx = opts.findIndex ? opts.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; }) : -1;
      ddFocusIdx = selIdx >= 0 ? selIdx : 0;
      opts[ddFocusIdx].focus();
    }
    function ddClose(returnFocus) {
      subjectBtn.setAttribute('aria-expanded', 'false');
      subjectPanel.hidden = true;
      ddFocusIdx = -1;
      if (returnFocus) subjectBtn.focus();
    }
    function ddSelect(opt) {
      var val = opt.getAttribute('data-value');
      opts.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      opt.setAttribute('aria-selected', 'true');
      subjectField.value = val;
      subjectVal.textContent = val;
      subjectBtn.classList.add('sap-selected');
      ddClose(true);
    }
    function ddReset() {
      opts.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      subjectField.value = '';
      subjectVal.textContent = 'Select an option';
      subjectBtn.classList.remove('sap-selected');
      subjectBtn.setAttribute('aria-expanded', 'false');
      subjectPanel.hidden = true;
      ddFocusIdx = -1;
    }

    subjectBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (subjectPanel.hidden) ddOpen(); else ddClose(true);
    });
    subjectBtn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ddOpen();
      }
    });
    subjectPanel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        ddFocusIdx = Math.min(ddFocusIdx + 1, opts.length - 1);
        opts[ddFocusIdx].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (ddFocusIdx <= 0) { ddClose(true); }
        else { ddFocusIdx--; opts[ddFocusIdx].focus(); }
      } else if (e.key === 'Home') {
        e.preventDefault();
        ddFocusIdx = 0; opts[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        ddFocusIdx = opts.length - 1; opts[ddFocusIdx].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (opts[ddFocusIdx]) ddSelect(opts[ddFocusIdx]);
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        ddClose(true);
      } else if (e.key === 'Tab') {
        ddClose(false);
      }
    });
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () { ddSelect(opt); });
      opt.addEventListener('mousedown', function (e) { e.preventDefault(); }); // prevent blur before click
    });
    document.addEventListener('click', function (e) {
      if (!subjectPanel.hidden && !subjectWrap.contains(e.target)) ddClose(false);
    });

    // ---- Focus / trap helpers -----------------------------------------------
    function focusablesIn(c) {
      var sel = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
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
    function restoreFocus() { if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e2) {} } }

    function onKey(e) {
      if (e.key === 'Escape') {
        if (!subjectPanel.hidden) { ddClose(true); return; }
        dismiss();
      } else if (e.key === 'Tab') {
        trap(e, modal);
      }
    }
    function onKeySuccess(e) { if (e.key === 'Escape') closeSuccess(); else if (e.key === 'Tab') trap(e, success); }

    // ---- Open / cancel / success --------------------------------------------
    function open() {
      lastFocus = document.activeElement;
      document.body.classList.remove('menu-open');
      var mb = document.getElementById('menuBtn');
      if (mb) mb.setAttribute('aria-expanded', 'false');
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      setTimeout(function () { fields.name.input.focus(); }, 0);
    }
    function dismiss() {
      ddClose(false);
      modal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      restoreFocus();
    }
    function toSuccess() {
      ddClose(false);
      modal.hidden = true;
      document.removeEventListener('keydown', onKey);
      form.reset();
      clearAllErrors();
      ddReset();
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

    // ---- Validation ---------------------------------------------------------
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
      var ok = true, firstBad = null;
      var name   = fields.name.input.value.trim();
      var email  = fields.email.input.value.trim();
      var mobile = fields.mobile.input.value.trim();
      if (!name)  { setError('name', 'Please enter your name.'); ok = false; firstBad = firstBad || fields.name.input; }
      if (!email) { setError('email', 'Please enter your email address.'); ok = false; firstBad = firstBad || fields.email.input; }
      else if (!EMAIL_RE.test(email)) { setError('email', 'Please enter a valid email address.'); ok = false; firstBad = firstBad || fields.email.input; }
      if (mobile && (!PHONE_RE.test(mobile) || digitCount(mobile) < 7)) { setError('mobile', 'Please enter a valid mobile number.'); ok = false; firstBad = firstBad || fields.mobile.input; }
      if (firstBad) firstBad.focus();
      return ok;
    }

    ['name', 'email'].forEach(function (key) {
      fields[key].input.addEventListener('input', function () { clearError(key); });
    });

    // ---- Submit -------------------------------------------------------------
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var label = sendBtn.textContent;
      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending…';

      var name    = fields.name.input.value.trim();
      var email   = fields.email.input.value.trim();
      var company = document.getElementById('sapCompany').value.trim();
      var data = {
        name:     name,
        email:    email,
        mobile:   fields.mobile.input.value.trim() || '—',
        company:  company || '—',
        location: document.getElementById('sapLocation').value.trim() || '—',
        subject:  subjectField.value || '—',
        message:  document.getElementById('sapMessage').value.trim() || '—'
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
          if (!res.ok) throw new Error('status ' + res.status);
          return res.json();
        });
      }

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

    // ---- Wiring -------------------------------------------------------------
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', dismiss);
    });
    success.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeSuccess);
    });
    document.getElementById('sapOk').addEventListener('click', closeSuccess);

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
