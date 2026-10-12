/**
 * VitisOS - Assistente de Voz para Campo & Adega
 * Capta ordens por voz (ex: "Adicionar 50 garrafas de Orange Wine lote 2025")
 */

let recognition = null;

function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("O seu navegador não suporta reconhecimento de voz. Recomenda-se o Google Chrome ou Safari.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'pt-PT';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        const statusEl = document.getElementById('voice-status');
        if (statusEl) {
            statusEl.classList.remove('hidden');
            statusEl.innerText = "🎙️ A ouvir... Fale agora (ex: 'Registar 100 garrafas de Tinto 2023')";
        }
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log("Comando de voz captado:", transcript);
        
        const statusEl = document.getElementById('voice-status');
        if (statusEl) {
            statusEl.innerText = ` Comandado captado: "${transcript}"`;
        }

        interpretarComandoVoz(transcript);
    };

    recognition.onerror = function(event) {
        console.error("Erro no reconhecimento de voz:", event.error);
        alert("Não foi possível reconhecer a voz. Tente novamente.");
    };

    recognition.start();
}

function interpretarComandoVoz(texto) {
    // Lógica de Extração com Inteligência Natural Básica / Regex
    const lower = texto.toLowerCase();
    
    // Extrai números
    const numeros = lower.match(/\d+/g);
    const quantidade = numeros ? parseInt(numeros[0]) : 10;

    let produto = "Vinho Registado por Voz";
    if (lower.includes('orange') || lower.includes('branco')) {
        produto = "Orange Wine Skin-Contact";
    } else if (lower.includes('tinto') || lower.includes('bonjardim')) {
        produto = "Bonjardim Tinto Biológico";
    }

    // Adiciona diretamente à tabela do inventário
    const tableBody = document.getElementById('inventory-table-body');
    if (tableBody) {
        const row = `
            <tr class="border-b border-white/5 hover:bg-white/5 transition bg-purple-500/10">
                <td class="py-3 px-4 font-medium">${produto}</td>
                <td class="py-3 px-4 text-gray-400">Lote Voz AI</td>
                <td class="py-3 px-4 font-semibold text-emerald-400">${quantidade} garrafas</td>
                <td class="py-3 px-4">4.20 €</td>
                <td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">🎙️ Comando Voz</span></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('afterbegin', row);
        alert(`Comando Processado: Adicionadas ${quantidade} garrafas de ${produto}!`);
    }
}
