/************************************************************/
/*          FUNCTION.JS OTIMIZADO + COMPATÍVEL              */
/************************************************************/

/* Aqui NÃO declaramos body, intervalos, viaturas, etc */
/* Eles já existem no script.js. */

/* Cache para acelerar datas Excel */
const cacheExcel = new Map();

/* ----------------------------------------------- */
/* 🔥 Converte Excel Date SOMENTE UMA VEZ POR SERIAL */
/* ----------------------------------------------- */
function formatExcelDate(serial) {
	if (cacheExcel.has(serial)) return cacheExcel.get(serial);

	if (!serial || typeof serial !== "number") {
		cacheExcel.set(serial, null);
		return null;
	}

	const parsed = XLSX.SSF.parse_date_code(serial);
	if (!parsed) {
		cacheExcel.set(serial, null);
		return null;
	}

	const jsDate = new Date(parsed.y, parsed.m - 1, parsed.d, parsed.H, parsed.M, parsed.S);

	const result = jsDate.toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	cacheExcel.set(serial, result);
	return result;
}

/* ----------------------------------------------- */
/* 🔥 ALLDATA — Pré-processa tudo em UMA passada    */
/* ----------------------------------------------- */
function allData(result) {
	// limpar estados globais (existem no script.js)
	viaturas = maquinas = motoristas = valorTotal = valorFormatado = duplicatas = table2 = valores = qtdAbastecimentos = qtdViaturas = table4 = null;

	intervalos = [];
	cacheExcel.clear();

	const data = new Uint8Array(result);
	const workbook = XLSX.read(data, { type: "array" });
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];

	const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
	const header = json.slice(0, 1);

	// MANTER body COMO ERA (necessário para updateUI2)
	body = json.slice(1, -1);

	const setMesAno = new Set();
	const setDiaMesAno = new Set();

	const setViaturas = new Set();
	const setMaquinas = new Set();
	const setMotoristas = new Set();

	const mapDuplicatas = new Map();

	let somaTotal = 0;

	// LOOP ÚNICO
	for (const row of body) {
		const dataFull = formatExcelDate(row[4]);
		if (!dataFull) continue;

		const dataDia = dataFull.split(",")[0]; // dd/mm/yyyy
		const [d, m, a] = dataDia.split("/");
		const mesAno = `${m}/${a}`;

		setMesAno.add(mesAno);
		setDiaMesAno.add(dataDia);

		const placa = row[5];
		if (placa) {
			if (placa.includes("MAQ")) setMaquinas.add(placa);
			else setViaturas.add(placa);
		}

		if (row[11]) setMotoristas.add(row[11]);

		somaTotal += Number(row[19]) || 0;

		const km = row[16];
		if (placa && km) {
			const chave = `${placa}_${km}`;
			if (!mapDuplicatas.has(chave)) mapDuplicatas.set(chave, []);
			mapDuplicatas.get(chave).push({
				id: row[0],
				placa,
				km,
				data: dataFull,
				tipoCombustivel: row[13],
				qtdLitros: row[14],
				valorEmissao: row[19],
			});
		}
	}

	intervalos = setMesAno.size > 1 ? [...setMesAno] : [...setDiaMesAno];

	viaturas = [...setViaturas];
	maquinas = [...setMaquinas];
	motoristas = [...setMotoristas];

	valorTotal = somaTotal;
	valorFormatado = somaTotal.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	duplicatas = [];
	for (const grupo of mapDuplicatas.values()) {
		if (grupo.length > 1) duplicatas.push(grupo);
	}
}

function reset() {
	document.querySelector("table")?.remove();
	document.querySelector("#myChart")?.remove();
}

function insertSetas() {
	if (document.querySelector("table") && !document.querySelector("#table1")) {
		document.querySelector(".setas").classList.remove("hidden");
	} else {
		document.querySelector(".setas").classList.add("hidden");
	}
}
