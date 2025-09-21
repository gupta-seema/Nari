// Basic form behavior: validation, real API authentication, and UI feedback
const form = document.getElementById('login-form');
const status = document.getElementById('status');
const toggle = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const guestBtn = document.getElementById('guest-btn');
const registerLink = document.createElement('button');
registerLink.type = 'button';
registerLink.textContent = 'Create account';
registerLink.className = 'secondary';
registerLink.style.marginLeft = 'auto';
document.querySelector('.actions').appendChild(registerLink);

function setStatus(text, type = 'info'){
  status.textContent = text;
  status.style.color = type === 'error' ? getComputedStyle(document.documentElement).getPropertyValue('--danger') : '';
}

toggle.addEventListener('click', () => {
  const shown = passwordInput.type === 'text';
  passwordInput.type = shown ? 'password' : 'text';
  toggle.textContent = shown ? 'Show' : 'Hide';
  toggle.setAttribute('aria-label', shown ? 'Show password' : 'Hide password');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('Validating...');

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    setStatus('Please fill in both fields.', 'error');
    return;
  }

  if (password.length < 6) {
    setStatus('Password must be at least 6 characters.', 'error');
    return;
  }

  setStatus('Signing in...');

  try {
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.message || 'Sign in failed');
    }

    // success
    localStorage.setItem('token', data.token);
    setStatus('Signed in successfully! Redirecting...');
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 600);
  } catch (err) {
    setStatus(err.message || 'Sign in failed', 'error');
  }
});

guestBtn.addEventListener('click', () => {
  setStatus('Continuing as guest...');
  setTimeout(() => {
    setStatus('Guest session started');
  }, 500);
});

registerLink.addEventListener('click', async () => {
  const email = form.email.value.trim();
  const password = form.password.value;
  const name = '';
  if (!email || !password) { setStatus('Please fill email and password to create account', 'error'); return; }
  setStatus('Creating account...');
  try {
    const resp = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('token', data.token);
    setStatus('Account created. Redirecting...');
    setTimeout(() => window.location.href = '/dashboard.html', 600);
  } catch (err) {
    setStatus(err.message || 'Registration failed', 'error');
  }
});
