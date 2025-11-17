function relatorio4() {
	reset();

	if (!table4) {
		let html = `
    <table id="table4">
      <thead>
        <th class="asc ordered">ORD</th>
        <th>PLACA</th>
        <th>MODELO</th>
        <th>ABASTECIMENTOS</th>
        <th>CONSUMO MÉDIO (KM/L)</th>
        <th>GASTO TOTAL</th>
        <th>KM RODADOS</th>
        <th>PROPRIEDADE</th>
        <th>CONTRATO</th>
      </thead>
      <tbody>
    `;

		for (const index in viaturas) {
			const viatura = viaturas[index];
			const rowsViatura = body.filter((row) => row[5] === viatura);
			const modelo = rowsViatura[0][7];
			const propriedade = rowsViatura[0][30];
			const contrato = rowsViatura[0][31];

			const consumoMedioArr = rowsViatura.map((row) => (row[18] ? row[18] : 0));
			const consumoMédio = (consumoMedioArr.reduce((acc, cur) => acc + cur) / consumoMedioArr.length).toFixed(2);

			const vezesAbastecidas = rowsViatura.length;
			const gastoTotal = rowsViatura
				.reduce((acc, cur) => {
					const preco = cur[19];
					return acc + preco;
				}, 0)
				.toFixed(2);
			const kmRodados = rowsViatura.reduce((acc, cur) => acc + cur[17], 0);
			html += `
      <tr>
        <td>${Number(index) + 1}</td>
        <td>${viatura}</td>
        <td>${modelo}</td>
        <td>${vezesAbastecidas}</td>
        <td>${consumoMédio}</td>
        <td>${gastoTotal}</td>
        <td>${kmRodados}</td>
        <td>${propriedade}</td>
        <td>${contrato}</td>
      </tr>`;
		}

		html += `</tbody></table>`;
		table4 = html;
	}

	document.querySelector("footer").insertAdjacentHTML("beforebegin", table4);

	insertSetas();
}

/* ----------------------------------------------- */
/* 🔥 SORT — COMPATÍVEL COM updateUI4              */
/* ----------------------------------------------- */
function updateUI4(col) {
	const sortedBy = document.querySelector(".dec") ? "dec" : "asc";
	const isStringCol = col === 1 || col === 2 || col === 7 || col === 8;

	const bodyTable4 = [...document.querySelectorAll("#table4 tbody tr")];

	if (sortedBy === "asc") {
		bodyTable4.sort((a, b) => {
			if (isStringCol) {
				// Classificação crescente para strings (Placa)
				return String(a.querySelectorAll("td")[col].textContent).localeCompare(String(b.querySelectorAll("td")[col].textContent));
			} else {
				// Classificação crescente para números (CÓDIGO, DATA, KM/LITROS)
				return Number(a.querySelectorAll("td")[col].textContent) - Number(b.querySelectorAll("td")[col].textContent);
			}
		});
	} else {
		bodyTable4.sort((a, b) => {
			if (isStringCol) {
				// Classificação decrescente para strings (Placa)
				// Inverte a ordem da comparação de strings
				return String(b.querySelectorAll("td")[col].textContent).localeCompare(String(a.querySelectorAll("td")[col].textContent));
			} else {
				// Classificação decrescente para números (CÓDIGO, DATA, KM/LITROS)
				return Number(b.querySelectorAll("td")[col].textContent) - Number(a.querySelectorAll("td")[col].textContent);
			}
		});
	}

	const tbody = document.querySelector("tbody");
	tbody.innerHTML = "";

	bodyTable4.forEach((tr) => {
		tbody.append(tr);
	});

	filtrarSearchBar();
}
