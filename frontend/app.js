document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  const message = document.getElementById('message');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    message.textContent = '';

    const username = form.username.value.trim();
    const password = form.password.value;

    if(!username || !password){
      message.textContent = 'Please enter username and password.';
      return;
    }

    // Fake auth: accept any non-empty values to demonstrate UI.
    message.style.color = 'green';
    message.textContent = 'Login successful — (demo)';

    // Normally you'd POST to an API here.
    setTimeout(()=>{
      // Clear form for demo purposes
      form.reset();
      message.textContent = '';
      message.style.color = '';
      alert('Logged in (demo). Replace with real auth flow.');
    }, 800);
  });
});
