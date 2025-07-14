reparteTarjetas();

document.querySelectorAll(".tarjeta").forEach(function (elemento) {
  elemento.addEventListener("click", descubrir);
});
console.log("init");
