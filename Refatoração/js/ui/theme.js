/**
 * @file Gerencia a customização da aparência (tema) do dashboard.
 * Lida com o armazenamento, carregamento e aplicação de temas de cores.
 */

/**
 * @constant {string} THEME_STORAGE_KEY - A chave usada para salvar o tema no localStorage.
 */
const THEME_STORAGE_KEY = 'dashboard-theme';

/**
 * @constant {object} colorConfig - Mapeia as seções e nomes das cores para as
 * variáveis CSS correspondentes. Usado para construir a UI de customização.
 */
export const colorConfig = {
    'Cores Principais': {
        'Primária (Destaques)': '--color-primary',
        'Primária (Hover)': '--color-primary-hover',
        'Texto em Botão Primário': '--color-primary-text',
    },
    'Cores de Fundo': {
        'Fundo Principal': '--color-bg-main',
        'Fundo de Cards': '--color-bg-card',
        'Fundo Interativo (Inputs)': '--color-bg-interactive',
        'Fundo Interativo (Hover)': '--color-bg-interactive-hover',
    },
    'Cores de Texto': {
        'Texto Principal': '--color-text-base',
        'Texto Secundário': '--color-text-muted',
        'Títulos': '--color-text-heading',
    },
    'Cores de Ação': {
        'Sucesso (Verde)': '--color-success',
        'Perigo (Vermelho)': '--color-danger',
        'Informação (Azul)': '--color-info',
        'Aviso (Laranja)': '--color-warning',
    },
    'Cores dos Gráficos': {
        'Cor 1': '--chart-color-1',
        'Cor 2': '--chart-color-2',
        'Cor 3': '--chart-color-3',
        'Cor 4': '--chart-color-4',
        'Cor 5': '--chart-color-5',
    }
};

/**
 * Aplica um objeto de tema (cores) às variáveis CSS no elemento root.
 * @param {object} theme - Um objeto onde as chaves são nomes de variáveis CSS e os valores são as cores.
 */
function applyTheme(theme) {
    if (!theme || Object.keys(theme).length === 0) return;
    for (const variable in theme) {
        // Garante que a propriedade pertence ao objeto e não ao seu protótipo.
        if (Object.prototype.hasOwnProperty.call(theme, variable) && theme[variable]) {
            document.documentElement.style.setProperty(variable, theme[variable]);
        }
    }
}

/**
 * Recupera o tema salvo no localStorage.
 * @returns {object} O objeto do tema parseado, ou um objeto vazio se não houver tema salvo.
 */
export function getThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    try {
        return savedTheme ? JSON.parse(savedTheme) : {};
    } catch (e) {
        console.error("Erro ao parsear o tema do localStorage:", e);
        return {};
    }
}

/**
 * Salva o tema atual (baseado nas variáveis CSS do documento) no localStorage.
 */
export function saveCurrentThemeToLocalStorage() {
    const theme = {};
    // Itera sobre a configuração de cores para pegar os valores atuais do DOM.
    for (const section in colorConfig) {
        for (const label in colorConfig[section]) {
            const varName = colorConfig[section][label];
            theme[varName] = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
    }
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
}


/**
 * Função de inicialização que carrega o tema do localStorage e o aplica.
 * Esta deve ser chamada quando a aplicação inicia.
 */
export function initializeTheme() {
    const theme = getThemeFromLocalStorage();
    applyTheme(theme);
}
