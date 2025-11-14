/* ----------------------------------------------- */
/* 🔥 RELATÓRIO 3 — GRÁFICO                        */
/* ----------------------------------------------- */
function relatorio3() {
  reset();

  const soUmDia = intervalos[0].split("/").length === 3;

  if (!valores) {
    valores = new Array(intervalos.length).fill(0);
    qtdAbastecimentos = new Array(intervalos.length).fill(0);
    qtdViaturas = new Array(intervalos.length).fill(0);

    const mapV = intervalos.map(() => new Set());

    for (const row of body) {
      const dFull = formatExcelDate(row[4]).split(",")[0]; // dd/mm/yyyy
      const [d, m, a] = dFull.split("/");
      const mesAno = `${m}/${a}`;

      let idx = soUmDia
        ? intervalos.indexOf(dFull)
        : intervalos.indexOf(mesAno);

      if (idx === -1) continue;

      valores[idx] += Number(row[19]) || 0;
      qtdAbastecimentos[idx]++;

      const placa = row[5];
      if (placa && !placa.includes("MAQ")) mapV[idx].add(placa);
    }

    for (let i = 0; i < intervalos.length; i++) {
      qtdViaturas[i] = mapV[i].size;
    }
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `<canvas id="myChart" style="max-width:90%;margin-top:40px;"></canvas>`
  );

  new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: intervalos,
      datasets: [
        {
          label: "Valor Total (R$)",
          data: valores,
          type: "line",
          borderWidth: 2,
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
          yAxisID: "valor",
        },
        {
          label: "Viaturas",
          data: qtdViaturas,
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          yAxisID: "qt",
          stack: "qtd",
        },
        {
          label: "Abastecimentos",
          data: qtdAbastecimentos,
          backgroundColor: "rgba(255, 206, 86, 0.8)",
          yAxisID: "qt",
          stack: "qtd",
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: "index", intersect: false },
      scales: {
        valor: { type: "linear", position: "left", beginAtZero: true },
        qt: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          stacked: true,
        },
      },
    },
  });
}
