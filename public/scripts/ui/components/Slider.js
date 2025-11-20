const $siguiente = document.getElementById('next');
const $anterior = document.getElementById('prev');

const $carrusel = document.querySelector('.slider');
const $deslizador = $carrusel.querySelector('.slider .slider_contenedor');
const $bordeMiniaturas = document.querySelector('.slider .thumbnail');
const $itemsMiniatura = $bordeMiniaturas.querySelectorAll('.item');

$bordeMiniaturas.appendChild($itemsMiniatura[0]);
const tiempoEjecucion = 1000;
const tiempoSiguienteAuto = 7000;

let tiempoFuera;
let siguienteAuto = setTimeout(() => {
  $siguiente.click();
}, tiempoSiguienteAuto);

const mostrarDeslizador = direccion => {
  const $itemsDeslizador = $deslizador.querySelectorAll('.slider .slider_contenedor .item');
  const $itemsMiniatura = document.querySelectorAll('.slider .thumbnail .item');
  
  if (direccion === 'next') {
    // Mueve el primer slide al final
    $deslizador.appendChild($itemsDeslizador[0]);
    // Mueve la primera miniatura al final
    $bordeMiniaturas.appendChild($itemsMiniatura[0]);

    // Añade clase para animación de avance
    $carrusel.classList.add('siguiente');
  } else {
    // Mueve el último slide al principio
    $deslizador.prepend($itemsDeslizador[$itemsDeslizador.length - 1]);
    // Mueve la última miniatura al principio
    $bordeMiniaturas.prepend($itemsMiniatura[$itemsMiniatura.length - 1]);
    
    // Añade clase para animación de retroceso
    $carrusel.classList.add('anterior');
  }
  
  // Limpia cualquier temporizador de animación previo
  clearTimeout(tiempoFuera);
  tiempoFuera = setTimeout(() => {
    $carrusel.classList.remove('siguiente');
    $carrusel.classList.remove('anterior');
  }, tiempoEjecucion);

  // Reinicia el temporizador de navegación automática
  clearTimeout(siguienteAuto);
  siguienteAuto = setTimeout(() => {
    $siguiente.click();
  }, tiempoSiguienteAuto);
};

export default function inicializarSlider() {
  $siguiente.onclick = () => mostrarDeslizador('next');
  $anterior.onclick = () => mostrarDeslizador('prev');
}