(() => {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  const setNav = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Close after choosing a link
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setNav(false);
    });
  }

  /* ---------- Accessible form validation ---------- */
  const form = document.getElementById('booking-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  const messages = {
    name: 'Enter your full name.',
    email: 'Enter a valid email address, like name@example.com.',
    service: 'Choose a service.'
  };

  const validate = (field) => {
    const error = document.getElementById(`${field.id}-error`);
    const valid = field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));

    // Link the error message to the field only while it is shown
    const hint = field.id === 'email' ? 'email-hint ' : '';
    field.setAttribute('aria-describedby', (hint + (valid ? '' : error.id)).trim());
    if (!field.getAttribute('aria-describedby')) field.removeAttribute('aria-describedby');

    error.textContent = valid ? '' : messages[field.id];
    return valid;
  };

  const fields = [...form.querySelectorAll('input, select')];

  fields.forEach((field) => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validate(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';

    const results = fields.map(validate);
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      firstInvalid.focus(); // move keyboard and screen reader users to the problem
      status.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // Replace with a real request, e.g. fetch(form.action, { method: 'POST', body: new FormData(form) })
    status.textContent = 'Request sent. Check your email for confirmation.';
    form.reset();
  });
})();