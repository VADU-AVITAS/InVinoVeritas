/**
 * VitisOS - Módulo de Leitura de Excel & CSV
 * Utiliza a biblioteca SheetJS para converter folhas de cálculo em inventário.
 */

function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Ler a primeira folha de cálculo
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para objeto JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Dados importados do Excel:", jsonData);
        processarDadosExcel(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

function processarDadosExcel(dados) {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    let html = '';
    dados.forEach((item) => {
        const produto = item.Produto || item.Vinho || 'Vinho Sem Nome';
        const lote = item.Lote || 'N/A';
        const qtd = item.Quantidade || item.Qtd || 0;
        const custo = item.CustoUnidade || item.Custo || 0;

        html += `
            <tr class="border-b border-white/5 hover:bg-white/5 transition">
                <td class="py-3 px-4 font-medium">${produto}</td>
                <td class="py-3 px-4 text-gray-400">${lote}</td>
                <td class="py-3 px-4 font-semibold text-emerald-400">${qtd} garrafas</td>
                <td class="py-3 px-4">${Number(custo).toFixed(2)} €</td>
                <td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">Importado Excel</span></td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
    alert(`Sucesso! ${dados.length} registos importados da folha de cálculo.`);
}
