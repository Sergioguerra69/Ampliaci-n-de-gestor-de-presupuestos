import { assert } from "chai";
import {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
  reiniciarGastos,
} from "../Apliacion de presupuestos/Ampliacion.js";

// Test listarGastos
describe("listarGastos", function () {
  beforeEach(() => reiniciarGastos());

  it("Devuelve un array vacío si no hay gastos", function () {
    assert.isEmpty(listarGastos());
  });
});

// Test CrearGasto
describe("CrearGasto", function () {
  beforeEach(() => reiniciarGastos());

  it("Comprobación de fecha y etiquetas", function () {
    let now = new Date();
    let descr = "Ejemplo de gasto";

    let gasto1 = new CrearGasto(descr);
    assert.equal(gasto1.descripcion, descr);
    assert.equal(gasto1.valor, 0);
    assert.equal(new Date(gasto1.fecha).getMonth(), now.getMonth());
    assert.equal(new Date(gasto1.fecha).getDate(), now.getDate());
    assert.isEmpty(gasto1.etiquetas);

    let gasto2 = new CrearGasto(descr, 23.55);
    assert.equal(gasto2.valor, 23.55);

    let gasto3 = new CrearGasto(descr, 23.55, "2021-10-06T13:10Z");
    assert.equal(gasto3.fecha, Date.parse("2021-10-06T13:10Z"));

    let gasto4 = new CrearGasto(descr, 23.55, "2021-10-06T13:10Z", "casa");
    assert.lengthOf(gasto4.etiquetas, 1);

    let gasto5 = new CrearGasto(
      descr,
      23.55,
      "2021-10-06T13:10Z",
      "casa",
      "supermercado"
    );
    assert.lengthOf(gasto5.etiquetas, 2);

    let gasto6 = new CrearGasto(
      descr,
      23.55,
      "2021-10-06T13:10Z",
      "casa",
      "supermercado",
      "comida"
    );
    assert.lengthOf(gasto6.etiquetas, 3);
  });

  it("mostrarGastoCompleto", function () {
    let valor = 23.55;
    let fechalocale = new Date("2021-10-06T13:10Z").toLocaleString();
    let gasto1 = new CrearGasto(
      "descripción del gasto",
      valor,
      "2021-10-06T13:10Z",
      "casa",
      "supermercado",
      "comida"
    );
    assert.equal(
      gasto1.mostrarGastoCompleto(),
      `Gasto correspondiente a descripción del gasto con valor ${valor} €.
Fecha: ${fechalocale}
Etiquetas:
- casa
- supermercado
- comida
`
    );
  });

  it("actualizarFecha", function () {
    let orig = Date.parse("2021-10-06T13:10Z");
    let nueva = Date.parse("2021-11-11T13:10Z");
    let gasto1 = new CrearGasto(
      "descripción del gasto",
      23.55,
      "2021-10-06T13:10Z"
    );
    gasto1.actualizarFecha("novalida");
    assert.equal(gasto1.fecha, orig);
    gasto1.actualizarFecha("2021-11-11T13:10Z");
    assert.equal(gasto1.fecha, nueva);
  });

  it("anyadirEtiquetas", function () {
    let gasto1 = new CrearGasto(
      "descripción del gasto",
      44.55,
      "2021-10-06T13:10Z",
      "casa",
      "supermercado",
      "comida"
    );
    gasto1.anyadirEtiquetas("nueva1");
    assert.lengthOf(gasto1.etiquetas, 4);

    let gasto2 = new CrearGasto(
      "descripción del gasto",
      44.55,
      "2021-10-06T13:10Z"
    );
    gasto2.anyadirEtiquetas("nueva1", "nueva2");
    assert.lengthOf(gasto2.etiquetas, 2);

    gasto2.anyadirEtiquetas("nueva2");
    assert.lengthOf(gasto2.etiquetas, 2);
  });

  it("borrarEtiquetas", function () {
    let gasto1 = new CrearGasto(
      "descripción del gasto",
      44.55,
      "2021-10-06T13:10Z",
      "casa",
      "supermercado",
      "comida"
    );
    gasto1.borrarEtiquetas("supermercado");
    assert.lengthOf(gasto1.etiquetas, 2);
    gasto1.borrarEtiquetas("casa", "comida");
    assert.isEmpty(gasto1.etiquetas);
  });
});

// Test anyadirGasto
describe("anyadirGasto", function () {
  beforeEach(() => reiniciarGastos());

  it("Añade gastos", function () {
    let gasto1 = new CrearGasto("gasto1", 23.44, "2021-10-06T13:10Z");
    let gasto2 = new CrearGasto("gasto2", 42.88, "2021-10-06T13:10Z");
    anyadirGasto(gasto1);
    anyadirGasto(gasto2);
    assert.lengthOf(listarGastos(), 2);
    assert.equal(listarGastos()[0].id, 0);
    assert.equal(listarGastos()[1].id, 1);
  });
});

// Test borrarGasto
describe("borrarGasto", function () {
  beforeEach(() => reiniciarGastos());

  it("Elimina un gasto por id", function () {
    let gasto1 = new CrearGasto("gasto1", 23.44);
    let gasto2 = new CrearGasto("gasto2", 42.88);
    anyadirGasto(gasto1);
    anyadirGasto(gasto2);
    borrarGasto(0);
    assert.lengthOf(listarGastos(), 1);
    assert.equal(listarGastos()[0].id, 1);
  });
});

// Test calcularTotalGastos
describe("calcularTotalGastos", function () {
  beforeEach(() => reiniciarGastos());

  it("Suma todos los gastos", function () {
    let gasto1 = new CrearGasto("gasto1", 43);
    let gasto2 = new CrearGasto("gasto2", 47.4);
    anyadirGasto(gasto1);
    anyadirGasto(gasto2);
    assert.equal(calcularTotalGastos(), 43 + 47.4);
  });
});

// Test calcularBalance
describe("calcularBalance", function () {
  beforeEach(() => reiniciarGastos());

  it("Calcula el balance con el presupuesto y los gastos", function () {
    let presupuesto = 1000;
    actualizarPresupuesto(presupuesto);

    let gasto1 = new CrearGasto("gasto1", 43);
    let gasto2 = new CrearGasto("gasto2", 47);
    anyadirGasto(gasto1);
    anyadirGasto(gasto2);

    assert.equal(calcularBalance(), presupuesto - 43 - 47);
  });
});
