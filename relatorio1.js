/* ----------------------------------------------- */
/* 🔥 RELATÓRIO 1 — GERAL                          */
/* ----------------------------------------------- */
function relatorio1() {
	reset();
	document.querySelector(".abas")?.remove();

	let html = `
  <div class="abas">
    <button id="relatorio1" class="aba selected">Relatório Geral</button>
    <button id="relatorio2" class="aba">Planilha</button>
    <button id="relatorio3" class="aba">Gráfico</button>
    <button id="relatorio4" class="aba">Dados Detalhados</button>
  </div>

<table id="table1" border="1">
<tr><td><h1>Valor Total</h1></td><td><h1>${valorFormatado}</h1></td></tr>
<tr><td><h1>Viaturas</h1></td><td><h1>${viaturas.length}</h1></td></tr>
<tr><td><h1>Máquinas</h1></td><td><h1>${maquinas.length}</h1></td></tr>
<tr><td><h1>Motoristas</h1></td><td><h1>${motoristas.length}</h1></td></tr>
<tr><td><h1>Abastecimentos</h1></td><td><h1>${body.length}</h1></td></tr>

<tr>
<td colspan="2" style="background:#f7e0e0;">
<h1 style="color:#c72c2c;">REGISTROS DUPLICADOS (${duplicatas.length})</h1>
</td>
</tr>
`;

	if (duplicatas.length === 0) {
		html += `<tr><td colspan="2">Nenhuma duplicata encontrada</td></tr>`;
	} else {
		for (const grupo of duplicatas) {
			const { placa, km } = grupo[0];
			html += `
      <tr>
        <td><h1>${placa} | KM: ${km}</h1></td>
        <td>${grupo.map((g) => `${g.id} (${g.data}) - ${g.tipoCombustivel} - ${g.qtdLitros} Litros - R$ ${g.valorEmissao}`).join("<br>")}</td>
      </tr>`;
		}
	}

	html += `</table>`;
	document.querySelector("footer").insertAdjacentHTML("beforebegin", html);

	insertSetas();
}
