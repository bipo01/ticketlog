/* ----------------------------------------------- */
/* 🔥 RELATÓRIO 2 – TABELA PRINCIPAL               */
/* ----------------------------------------------- */
function relatorio2() {
	reset();

	if (!table2) {
		let html = `
    <table id="table2">
      <thead>
        <th>CÓDIGO</th>
        <th>PLACA</th>
        <th>MODELO</th>
        <th class="asc ordered">DATA</th>
        <th>HODÔMETRO</th>
        <th>KM/LITROS</th>
      </thead>
      <tbody>
    `;

		for (const row of body) {
			html += `
      <tr>
        <td>${row[0]}</td>
        <td>${row[5]}</td>
        <td>${row[7]}</td>
        <td>${formatExcelDate(row[4])}</td>
        <td>${row[16]}</td>
        <td>${!row[18] ? 0 : row[18]}</td>
      </tr>`;
		}

		html += `</tbody></table>`;
		table2 = html;
	}

	document.querySelector("footer").insertAdjacentHTML("beforebegin", table2);

	insertSetas();
}

/* ----------------------------------------------- */
/* 🔥 SORT — COMPATÍVEL COM updateUI2              */
/* ----------------------------------------------- */
function updateUI2(col) {
	const sortedBy = document.querySelector(".dec") ? "dec" : "asc";
	const isStringCol = col === 5;

	if (sortedBy === "asc") {
		body.sort((a, b) => {
			if (isStringCol) {
				// Classificação crescente para strings (Placa)
				return String(a[col]).localeCompare(String(b[col]));
			} else {
				// Classificação crescente para números (CÓDIGO, DATA, KM/LITROS)
				return Number(a[col]) - Number(b[col]);
			}
		});
	} else {
		body.sort((a, b) => {
			if (isStringCol) {
				// Classificação decrescente para strings (Placa)
				// Inverte a ordem da comparação de strings
				return String(b[col]).localeCompare(String(a[col]));
			} else {
				// Classificação decrescente para números (CÓDIGO, DATA, KM/LITROS)
				return Number(b[col]) - Number(a[col]);
			}
		});
	}

	const tbody = document.querySelector("tbody");
	tbody.innerHTML = "";

	for (const row of body) {
		tbody.insertAdjacentHTML(
			"beforeend",
			`
      <tr>
        <td>${row[0]}</td>
        <td>${row[5]}</td>
        <td>${row[7]}</td>
        <td>${formatExcelDate(row[4])}</td>
        <td>${row[16]}</td>
        <td>${!row[18] ? 0 : row[18]}</td>
      </tr>`
		);
	}

	filtrarSearchBar();
}
