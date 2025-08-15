/**
 * @file Renderiza o conteúdo da aba "Customização".
 * Constrói a interface de seleção de cores para a personalização do tema.
 */

// Importa a configuração de cores e as funções de manipulação do tema.
import { colorConfig, getThemeFromLocalStorage, saveCurrentThemeToLocalStorage } from '../ui/theme.js';

/**
 * Popula a aba de Customização e configura seus eventos.
 * @param {Function} onSaveTheme - Callback para salvar o tema na base de dados.
 * @param {Function} onResetTheme - Callback para resetar o tema para o padrão.
 * @param {Function} onColorChange - Callback para redesenhar elementos (como gráficos) que dependem de cores.
 */
export function populateCustomizationTab(onSaveTheme, onResetTheme, onColorChange) {
    const container = document.getElementById('customization-tab');
    if (!container || container.innerHTML !== '') return; // Renderiza apenas uma vez.

    let html = `
        <div class="bg-card p-4 sm:p-6 rounded-lg shadow-lg">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 class="text-2xl font-semibold">Customização da Aparência</h2>
                    <p class="text-sm text-muted">Altere as cores do sistema. As alterações são salvas localmente de forma automática.</p>
                </div>
                <div class="flex items-center gap-4">
                    <button id="reset-theme-button" class="bg-danger hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto transition-all">Resetar Cores</button>
                    <button id="save-theme-button" class="bg-success hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg w-full sm:w-auto transition-all">Salvar Tema na Nuvem</button>
                </div>
            </div>
            <div class="space-y-8">`;

    const currentTheme = getThemeFromLocalStorage();

    // Itera sobre a configuração de cores para criar os seletores.
    for (const sectionTitle in colorConfig) {
        html += `
            <div>
                <h3 class="text-xl font-semibold mb-4 text-primary border-b border-main pb-2">${sectionTitle}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">`;
        for (const label in colorConfig[sectionTitle]) {
            const varName = colorConfig[sectionTitle][label];
            // Usa a cor do tema salvo ou o valor computado do estilo atual.
            const colorValue = currentTheme[varName] || getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            html += `
                <div class="flex flex-col">
                    <label for="${varName}" class="text-sm text-muted mb-2">${label}</label>
                    <div class="flex items-center gap-2 bg-interactive p-2 rounded-lg border border-main">
                        <input type="color" id="${varName}" data-variable="${varName}" value="${colorValue}" class="w-8 h-8 rounded border-none cursor-pointer bg-transparent">
                        <span class="font-mono text-sm">${colorValue}</span>
                    </div>
                </div>`;
        }
        html += `</div></div>`;
    }

    html += `</div></div>`;
    container.innerHTML = html;

    // --- Event Listeners ---
    container.querySelectorAll('input[type="color"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const variable = e.target.dataset.variable;
            const value = e.target.value;
            // Aplica a cor à variável CSS em tempo real.
            document.documentElement.style.setProperty(variable, value);
            e.target.nextElementSibling.textContent = value;
            // Salva automaticamente no localStorage.
            saveCurrentThemeToLocalStorage();
            // Se for uma cor de gráfico, sinaliza para redesenhar.
            if (variable.startsWith('--chart-color')) {
                onColorChange();
            }
        });
    });

    document.getElementById('reset-theme-button').addEventListener('click', (e) => onResetTheme(e.currentTarget));
    document.getElementById('save-theme-button').addEventListener('click', (e) => onSaveTheme(e.currentTarget));
}
