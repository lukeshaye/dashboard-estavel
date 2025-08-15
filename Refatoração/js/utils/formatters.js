/**
 * @file Contém funções puras para formatação de dados.
 * Módulos como este são ótimos para isolar a lógica de apresentação
 * e garantir que a formatação seja consistente em toda a aplicação.
 */

/**
 * Formata um valor numérico como uma string de moeda no formato BRL (Real Brasileiro).
 * @param {number} value - O valor a ser formatado. O padrão é 0 se nada for fornecido.
 * @returns {string} - A string formatada, por exemplo, "R$ 1.234,56".
 */
export const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
};
