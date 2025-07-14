function recogeDatos(evento) {
  evento.preventDefault();

  var nombre = document.querySelector("#nombre").value;
  var fecha = document.querySelector("#fecha").value;
  var edad = 2025 - fecha;

  var bienvenida = document.querySelector("#bienvenida");

  bienvenida.textContent = "Olá, meu nome é " + nombre + " e tenho " + edad + " anos."

  // console.log(mensagem);

  // EJERCICIO: declara las variables necesarias (puedes necesitar
  // más de una) para componer el mensaje de bienvenida

  // EJERCICIO: crea un condicional que dé un mensaje u otro en
  // función de la edad

  // BONUS: si quieres, puedes comprobar si alguno de los campos
  // está vacío y modificar el mensaje de bienvenida para pedir
  // Que se rellene

  // EJERCICIO: Realiza la composició del mensaje final y cárgalo
  // en la variable que hayas preparado

  // EJERCICIO: Añade el mensaje final como contenido HTML del
  // nodo que hemos cargado en la variable bienvenida
}

var miForm = document.querySelector("#formulario");

miForm.addEventListener("submit", recogeDatos);
