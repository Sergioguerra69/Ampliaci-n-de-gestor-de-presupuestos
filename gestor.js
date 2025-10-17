// Variable global para el presupuesto
let presupuesto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(valor) {
  if (typeof valor === "number" && valor >= 0) {
    presupuesto = valor;
    return presupuesto;
  } else {
    console.error("Error: el valor debe ser un número no negativo.");
    return -1;
  }
}

// Función para mostrar el presupuesto
function mostrarPresupuesto() {
  return `Tu presupuesto actual es de ${presupuesto} €`;
}

// Función constructora para crear un gasto
function CrearGasto(descripcion, valor) {
  if (typeof valor !== "number" || valor < 0) {
    valor = 0;
  }

  return {
    descripcion: descripcion,
    valor: valor,
    mostrarGasto: function () {
      return `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`;
    },
    actualizarDescripcion: function (nuevaDescripcion) {
      this.descripcion = nuevaDescripcion;
    },
    actualizarValor: function (nuevoValor) {
      if (typeof nuevoValor === "number" && nuevoValor >= 0) {
        this.valor = nuevoValor;
      }
    },
  };
}

// Exportamos las funciones para usar en HTML o tests
export { actualizarPresupuesto, mostrarPresupuesto, CrearGasto };
