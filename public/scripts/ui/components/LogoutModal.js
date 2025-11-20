const $userAvatarBtn = document.getElementById('user-avatar-btn');
const $logoutModal = document.getElementById('logout-modal');
const $logoutBtn = document.getElementById('logout-btn');
const $modalOverlay = document.getElementById('modal-overlay');

const LogoutModal = () => {
  document.addEventListener('DOMContentLoaded', setupEventListeners);
}

const cerrarSesion = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  document.location.href = '/';

  cerrarModal();
}

const cerrarModal = () => {
  $logoutModal.classList.remove('active');
  $modalOverlay.classList.remove('active');
}

const toggleModal = e => {
  if (e) e.stopPropagation();
  $logoutModal.classList.toggle('active');
  $modalOverlay.classList.toggle('active');
}

const clickFuera = e => {
  if (e) e.stopPropagation();
  if (!$logoutModal.contains(e.target) && e.target !== $userAvatarBtn) {
    closeModal();
  }
}

const setupEventListeners = () => {
  $userAvatarBtn.addEventListener('click', toggleModal);
  $logoutBtn.addEventListener('click', cerrarSesion);
  $modalOverlay.addEventListener('click', cerrarModal);
  document.addEventListener('click', clickFuera);
};

export default LogoutModal;
