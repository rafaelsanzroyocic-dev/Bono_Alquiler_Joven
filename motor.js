// =====================================================================
//  MOTOR DE INFERENCIA · encadenamiento hacia delante (forward chaining)
//  No sabe nada de alquileres: solo aplica las reglas de reglas.js
//  a los hechos hasta que no se pueda deducir nada nuevo.
// =====================================================================

function inferir(hechos) {
  const memoriaTrabajo = new Set(); // hechos deducidos
  const disparadas = new Set();     // reglas ya aplicadas
  const traza = [];                 // explicación paso a paso
  let ciclo = 0, hayCambios = true;

  while (hayCambios) {
    hayCambios = false;
    ciclo++;
    for (const r of REGLAS) {
      if (disparadas.has(r.id)) continue;

      if (r.tipo === "requisito") {
        const ok = r.condicion(hechos);
        const concl = (ok ? "cumple_" : "no_cumple_") + r.clave;
        memoriaTrabajo.add(concl);
        traza.push({ ciclo, regla: r.id, texto: r.texto(), resultado: ok, conclusion: concl, motivo: r.motivo(hechos) });
        disparadas.add(r.id);
        hayCambios = true;
      } else if (r.condicion(hechos, memoriaTrabajo)) {
        memoriaTrabajo.add(r.conclusion);
        traza.push({ ciclo, regla: r.id, texto: r.texto(), resultado: true, conclusion: r.conclusion });
        disparadas.add(r.id);
        hayCambios = true;
      }
    }
  }

  const derecho = memoriaTrabajo.has("tiene_derecho");
  const cuantia = memoriaTrabajo.has("cuantia_incrementada") ? P.cuantiaIncrementada
                : memoriaTrabajo.has("cuantia_base") ? P.cuantiaBase : 0;
  const incumplidos = traza.filter(t => t.resultado === false);
  return { derecho, cuantia, incumplidos, traza, memoriaTrabajo: [...memoriaTrabajo] };
}

// Para poder probarlo también fuera del navegador (Node.js)
if (typeof module !== "undefined") module.exports = { inferir };
