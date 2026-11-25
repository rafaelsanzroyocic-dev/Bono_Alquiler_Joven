// =====================================================================
//  BASE DE CONOCIMIENTO · Bono Alquiler Joven de Villaverde (ficticio)
//  Aquí vive TODO el conocimiento del experto: parámetros y reglas.
//  Si cambia la convocatoria, SOLO se modifica este archivo.
// =====================================================================

const PARAMETROS = {
  convocatoria: "2026",
  edadMin: 18,
  edadMax: 35,
  mesesEmpadronamientoMin: 12,
  ingresosMax: 25000,      // € anuales de la unidad de convivencia
  rentaMax: 700,           // € de alquiler mensual
  discapacidadMin: 33,     // % para la cuantía incrementada
  cuantiaBase: 150,        // €/mes
  cuantiaIncrementada: 200 // €/mes
};

const P = PARAMETROS;
const eur = n => n.toLocaleString("es-ES") + " €";

// Reglas de producción SI–ENTONCES.
// Las de tipo "requisito" concluyen cumple_X o no_cumple_X.
const REGLAS = [
  {
    id: "R1", tipo: "requisito", clave: "edad",
    texto: () => `SI edad entre ${P.edadMin} y ${P.edadMax} años ENTONCES cumple_edad`,
    condicion: h => h.edad >= P.edadMin && h.edad <= P.edadMax,
    motivo: h => `Tiene ${h.edad} años (se exige entre ${P.edadMin} y ${P.edadMax}).`
  },
  {
    id: "R2", tipo: "requisito", clave: "empadronamiento",
    texto: () => `SI empadronamiento ≥ ${P.mesesEmpadronamientoMin} meses ENTONCES cumple_empadronamiento`,
    condicion: h => h.mesesEmpadronamiento >= P.mesesEmpadronamientoMin,
    motivo: h => `Lleva ${h.mesesEmpadronamiento} meses empadronado/a (mínimo ${P.mesesEmpadronamientoMin}).`
  },
  {
    id: "R3", tipo: "requisito", clave: "ingresos",
    texto: () => `SI ingresos anuales ≤ ${eur(P.ingresosMax)} ENTONCES cumple_ingresos`,
    condicion: h => h.ingresos <= P.ingresosMax,
    motivo: h => `Ingresos de ${eur(h.ingresos)} (máximo ${eur(P.ingresosMax)}).`
  },
  {
    id: "R4", tipo: "requisito", clave: "contrato",
    texto: () => `SI es titular del contrato de alquiler ENTONCES cumple_contrato`,
    condicion: h => h.contrato === true,
    motivo: h => h.contrato ? "Es titular del contrato." : "No es titular del contrato de alquiler."
  },
  {
    id: "R5", tipo: "requisito", clave: "renta",
    texto: () => `SI renta mensual ≤ ${eur(P.rentaMax)} ENTONCES cumple_renta`,
    condicion: h => h.renta <= P.rentaMax,
    motivo: h => `Paga ${eur(h.renta)} al mes (máximo ${eur(P.rentaMax)}).`
  },
  {
    id: "R6", tipo: "requisito", clave: "vivienda",
    texto: () => `SI no es propietario de vivienda ENTONCES cumple_vivienda`,
    condicion: h => h.propietario === false,
    motivo: h => h.propietario ? "Es propietario/a de una vivienda." : "No es propietario/a de vivienda."
  },
  {
    id: "R7", tipo: "decision",
    texto: () => "SI cumple los 6 requisitos ENTONCES tiene_derecho",
    condicion: (h, mt) => ["edad", "empadronamiento", "ingresos", "contrato", "renta", "vivienda"]
      .every(k => mt.has("cumple_" + k)),
    conclusion: "tiene_derecho"
  },
  {
    id: "R8", tipo: "decision",
    texto: () => "SI incumple algún requisito ENTONCES solicitud_denegada",
    condicion: (h, mt) => [...mt].some(x => x.startsWith("no_cumple_")),
    conclusion: "solicitud_denegada"
  },
  {
    id: "R9", tipo: "decision",
    texto: () => `SI tiene_derecho Y (hijos a cargo O discapacidad ≥ ${P.discapacidadMin} %) ENTONCES cuantía ${P.cuantiaIncrementada} €/mes`,
    condicion: (h, mt) => mt.has("tiene_derecho") && (h.hijos > 0 || h.discapacidad >= P.discapacidadMin),
    conclusion: "cuantia_incrementada"
  },
  {
    id: "R10", tipo: "decision",
    texto: () => `SI tiene_derecho Y NO cuantía incrementada ENTONCES cuantía ${P.cuantiaBase} €/mes`,
    condicion: (h, mt) => mt.has("tiene_derecho") && !mt.has("cuantia_incrementada"),
    conclusion: "cuantia_base"
  }
];
