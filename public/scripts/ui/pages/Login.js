const $form = document.querySelector('.login-form');
const $error = document.querySelector('.text-error');

$form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  await login(data);
});

const login = async data => {
  try {
    const response = await fetch('http://localhost:4000/api/auth/docente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    if(!response.ok) return $error.classList.remove('oculto');

    const resJson = await response.json();
    if(resJson.redirect) window.location.href = resJson.redirect;
  } 
  catch (error) {
    console.error(error);
  }
}
