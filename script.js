let body;
let intervalos = [];

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
	if (element.id === "relatorio3") {
		relatorio3();
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
