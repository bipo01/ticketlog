let body;

const form = document.querySelector("form");
const fileInput = document.querySelector("#file");

const dropzone = document.querySelector("#dropzone"); // Você precisará do div <div id="dropzone">...</div> no seu HTML

// 1. Configuração do Dropzone
dropzone.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropzone.classList.add("dragover"); // Classe para feedback visual (ver CSS)
});

dropzone.addEventListener("dragleave", () => {
	dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropzone.classList.remove("dragover");

	const files = e.dataTransfer.files;
	if (files.length > 0) {
		// ESSENCIAL: Injeta o arquivo solto no input file (ID #file)
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(files[0]);
		fileInput.files = dataTransfer.files;

		fileInput.dispatchEvent(new Event("input"));

		// Feedback de arquivo selecionado
		dropzone.querySelector("p").textContent = `Arquivo selecionado: ${files[0].name}`;
	}
});

// Permite clicar no dropzone para abrir o seletor de arquivo
dropzone.addEventListener("click", () => {
	fileInput.click();
});

// Feedback de arquivo selecionado (via clique)
fileInput.addEventListener("change", () => {
	if (fileInput.files.length > 0) {
		dropzone.querySelector("p").textContent = `Arquivo selecionado: ${fileInput.files[0].name}`;
	} else {
		dropzone.querySelector("p").textContent = "Arraste e solte o arquivo Excel aqui ou clique para selecionar.";
	}
});

fileInput.addEventListener("input", (e) => {
	// e.preventDefault();

	const fileInput = document.querySelector("#file");
	const file = fileInput.files[0];

	if (!file) {
		return;
	}

	const reader = new FileReader();

	reader.onload = function (e) {
		allData(e.target.result);
		relatorio1();
	};

	reader.readAsArrayBuffer(file);
});

function formatExcelDate(serial) {
	if (!serial || typeof serial !== "number") return null;

	const parsed = XLSX.SSF.parse_date_code(serial);
	if (!parsed) return null;

	const jsDate = new Date(parsed.y, parsed.m - 1, parsed.d, parsed.H, parsed.M, parsed.S);

	return jsDate.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

document.addEventListener("click", (e) => {
	const element = e.target;
	if (element.classList.contains("aba")) {
		document.querySelector(".selected")?.classList.remove("selected");
		element.classList.add("selected");
	}

	if (element.id === "relatorio1") {
		relatorio1();
	}
	if (element.id === "relatorio2") {
		relatorio2();
	}

	if (element.closest("thead")?.closest("#table2")) {
		document.querySelector(".ordered")?.classList.remove("ordered");
		element.classList.add("ordered");

		if (element.classList.contains("asc")) {
			element.classList.remove("asc");
			element.classList.add("dec");
		} else if (element.classList.contains("dec")) {
			element.classList.remove("dec");
			element.classList.add("asc");
		} else {
			document.querySelector(".asc")?.classList.remove("asc");
			document.querySelector(".dec")?.classList.remove("dec");
			element.classList.add("dec");
		}

		const orderedBy = document.querySelector(".ordered").textContent;

		switch (orderedBy) {
			case "DATA":
				updateUI2(4);
				break;

			case "KM/LITROS":
				updateUI2(18);
				break;

			case "PLACA":
				updateUI2(5);
				break;

			case "CÓDIGO":
				updateUI2(0);
				break;

			default:
				break;
		}
	}
});

function allData(result) {
	const data = new Uint8Array(result);
	const workbook = XLSX.read(data, { type: "array" });

	// Pegando a primeira aba (sheet)
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];

	// Convertendo para JSON
	const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
	const header = json.slice(0, 1);
	body = json.slice(1, -1);
}

function relatorio1() {
	const viaturas = [...new Set(body.map((linha) => linha[5]).filter((item) => item && !item.includes("MAQ")))];

	const maquinas = [...new Set(body.map((linha) => linha[5]).filter((item) => item && item.includes("MAQ")))];

	const motoristas = [...new Set(body.map((linha) => linha[11]))];
	const valorTotal = body.reduce((acc, cur) => {
		const value = Number(cur[19]);
		return acc + value;
	}, 0);

	const valorFormatado = valorTotal.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	const checarDuplicatasArr = [];
	body.forEach((row) => {
		// Garante que os campos não são nulos/undefined antes de criar o objeto
		if (row[5] && row[16]) {
			const obj = {
				id: row[0],
				placa: row[5], // Coluna F
				km: row[16], // Coluna Q
				data: formatExcelDate(row[4]),
			};
			checarDuplicatasArr.push(obj);
		}
	});

	// ⭐️ CORREÇÃO: Usando Map para agrupar ocorrências por chave única (placa + km)
	const contagemOcorrencias = new Map();

	checarDuplicatasArr.forEach((item) => {
		// Chave única para identificar a transação (placa e km)
		const chave = `${item.placa}_${item.km}`;

		// Se a chave já existe, adiciona o item ao array existente; caso contrário, inicializa o array.
		if (contagemOcorrencias.has(chave)) {
			contagemOcorrencias.get(chave).push(item);
		} else {
			contagemOcorrencias.set(chave, [item]);
		}
	});

	// Filtra o mapa para obter apenas os grupos com mais de uma ocorrência (duplicatas reais)
	const gruposDuplicados = [];
	for (const grupo of contagemOcorrencias.values()) {
		// Se o grupo tiver mais de 1 elemento, é uma duplicata
		if (grupo.length > 1) {
			gruposDuplicados.push(grupo);
		}
	}

	// Substitua a variável 'duplicatas' para manter a compatibilidade com o restante do seu código
	const duplicatas = gruposDuplicados;

	// A variável 'duplicatas' agora contém um array de arrays, onde cada array aninhado
	// é um grupo único de registros duplicados (Ex: [[objA1, objA2], [objB1, objB2, objB3]])

	// ... o restante da sua lógica continua usando a variável 'duplicatas'

	document.querySelector("table")?.remove();
	document.querySelector(".abas")?.remove();

	const html = `
    <div class="abas">
			<button id="relatorio1" class="aba">Relatório 1</button>
			<button id="relatorio2" class="aba">Relatório 2</button>
			<button id="relatorio3" class="aba">Relatório 3</button>
		</div>
<table id="table1" border="1">
  <tr>
    <td><h1>Valor Total de Abastecimentos</h1></td>
    <td><h1>${valorFormatado}</h1></td>
  </tr>
  <tr>
    <td><h1>Quantidade de Viaturas</h1></td>
    <td><h1>${viaturas.length}</h1></td>
  </tr>
  <tr>
    <td><h1>Quantidade de Máquinas</h1></td>
    <td><h1>${maquinas.length}</h1></td>
  </tr>
  <tr>
    <td><h1>Quantidade de Motoristas</h1></td>
    <td><h1>${motoristas.length}</h1></td>
  </tr>
  <tr>
    <td><h1>Quantidade de Abastecimentos</h1></td>
    <td><h1>${body.length}</h1></td>
  </tr>
  
  <tr>
    <td colspan="2" style="background-color: #f7e0e0;">
      <h1 style="color: #c72c2c;">REGISTROS DUPLICADOS (${duplicatas.length})</h1>
    </td>
  </tr>
  
  ${
			// Itera sobre o array duplicatas.
			// O array 'duplicatas' contém grupos de objetos que são duplicados.
			// Cada 'arr' dentro de 'duplicatas' é um array de objetos repetidos (Ex: [obj1, obj2]).
			duplicatas.length
				? duplicatas
						.map((arr) => {
							// Garante que o arr seja um array e tenha pelo menos 2 elementos (a duplicata).
							if (Array.isArray(arr) && arr.length >= 2) {
								// Pega as placas e KMs para o cabeçalho do grupo
								const placaKm = `${arr[0].placa} | KM: ${arr[0].km}`;

								// Mapeia os IDs (primeira coluna) e o campo da placa/KM (segunda coluna)
								const idList = arr.map((item) => `${item.id} (${item.data})`).join("<br/>");

								return `
    <tr>
        <td><h1>${placaKm}</h1></td>
        <td><p style="font-size: 0.9em;">${idList}</p></td>
    </tr>`;
							}
							return ""; // Retorna string vazia se o formato não for o esperado
						})
						.join("") // Junta todos os resultados mapeados em uma string
				: '<tr><td colspan="2">Nenhuma duplicata encontrada (Placa e KM)</td></tr>'
		}
</table>
`;

	document.body.insertAdjacentHTML("beforeend", html);

	document.querySelector("#relatorio1").classList.add("selected");
}

function relatorio2() {
	document.querySelector("table")?.remove();
	const parent = `<table id="table2">
			<thead>
				<th>CÓDIGO</th>
				<th>PLACA</th>
				<th class="asc ordered">DATA</th>
				<th>KM/LITROS</th>
			</thead>
			<tbody>
				
			</tbody>
		</table>`;
	document.body.insertAdjacentHTML("beforeend", parent);
	body.forEach((row) => {
		const html = `
    <tr>
      <td>${row[0]}</td>
      <td>${row[5]}</td>
      <td>${formatExcelDate(row[4])}</td>
      <td>${row[18]}</td>
    </tr>
    `;
		document.querySelector("tbody").insertAdjacentHTML("beforeend", html);
	});
}

function updateUI2(col) {
	let sortedBy;
	if (document.querySelector(".dec")) {
		sortedBy = "dec";
	} else {
		sortedBy = "asc";
	}

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

	document.querySelector("tbody").innerHTML = "";

	body.forEach((row) => {
		const html = `
    <tr>
      <td>${row[0]}</td>
      <td>${row[5]}</td>
      <td>${formatExcelDate(row[4])}</td>
      <td>${row[18]}</td>
    </tr>
    `;

		document.querySelector("tbody").insertAdjacentHTML("beforeend", html);
	});
}
