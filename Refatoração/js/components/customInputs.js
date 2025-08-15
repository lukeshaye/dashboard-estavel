/**
 * @file Módulo para criação de componentes de formulário customizados (Select, Datepicker, Timepicker).
 * Este módulo encapsula a lógica complexa para criar inputs interativos e estilizados
 * que não são facilmente customizáveis com CSS padrão.
 */

// O container onde os pop-ups (calendário, seletor de tempo) serão renderizados.
const popupContainer = document.getElementById('popup-container');

/**
 * Fecha qualquer pop-up que esteja aberto.
 * Remove o elemento do DOM após a animação de fade-out.
 */
function closePopup() {
    const backdrop = popupContainer.querySelector('.popup-backdrop');
    if (backdrop) {
        backdrop.classList.remove('open');
        setTimeout(() => {
            popupContainer.innerHTML = '';
        }, 300); // Duração da animação
    }
}

/**
 * Abre um pop-up, inserindo seu conteúdo no container de pop-ups.
 * @param {HTMLElement} contentElement - O elemento HTML a ser exibido dentro do pop-up.
 */
function openPopup(contentElement) {
    popupContainer.innerHTML = ''; // Limpa pop-ups anteriores
    const backdrop = document.createElement('div');
    backdrop.className = 'popup-backdrop';
    backdrop.appendChild(contentElement);
    popupContainer.appendChild(backdrop);

    // Força o navegador a aplicar o estilo inicial antes de adicionar a classe 'open'
    backdrop.getBoundingClientRect();
    backdrop.classList.add('open');

    // Adiciona evento para fechar o pop-up ao clicar no fundo escuro (backdrop).
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            closePopup();
        }
    });
}

/**
 * Cria o conteúdo para um pop-up de seleção (dropdown).
 * @param {Array<object>} options - As opções a serem exibidas.
 * @param {string} selectedValue - O valor atualmente selecionado.
 * @param {Function} onSelect - A função de callback a ser chamada quando uma opção é selecionada.
 * @returns {HTMLElement} O elemento do pop-up de seleção.
 */
function createSelectPopup(options, selectedValue, onSelect) {
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select-options scrollable-list';

    options.forEach(opt => {
        const optionEl = document.createElement('div');
        optionEl.className = 'custom-select-option';
        optionEl.textContent = opt.label;
        optionEl.dataset.value = opt.value;
        if (opt.value === selectedValue) optionEl.classList.add('selected');
        if (opt.disabled) optionEl.classList.add('disabled');

        if (!opt.disabled) {
            optionEl.addEventListener('click', () => onSelect(opt.value, opt.label));
        }
        optionsContainer.appendChild(optionEl);
    });

    popupContent.appendChild(optionsContainer);
    return popupContent;
}

/**
 * Cria o conteúdo para um pop-up de seletor de data (datepicker).
 * @param {string} initialDate - A data inicial no formato 'YYYY-MM-DD'.
 * @param {Function} onSelect - Callback chamado quando uma data é selecionada.
 * @returns {HTMLElement} O elemento do pop-up de calendário.
 */
function createDatePickerPopup(initialDate, onSelect) {
    const container = document.createElement('div');
    container.className = 'popup-content custom-datepicker-container';

    let currentDate = initialDate ? new Date(initialDate + 'T00:00:00') : new Date();
    currentDate = isNaN(currentDate.getTime()) ? new Date() : currentDate;
    let viewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        let daysHtml = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<span>${d}</span>`).join('');

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            daysHtml += `<div class="datepicker-day other-month"></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            let classes = "datepicker-day";
            if (dayDate.toDateString() === new Date().toDateString()) classes += " today";
            if (dayDate.toDateString() === currentDate.toDateString()) classes += " selected";
            daysHtml += `<div class="${classes}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}">${i}</div>`;
        }

        container.innerHTML = `
            <div class="datepicker-header">
                <button class="prev-month-btn"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
                <div class="datepicker-month-year">${monthNames[month]} ${year}</div>
                <button class="next-month-btn"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
            <div class="datepicker-grid">${daysHtml}</div>`;

        container.querySelector('.prev-month-btn').addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() - 1);
            renderCalendar();
        });
        container.querySelector('.next-month-btn').addEventListener('click', () => {
            viewDate.setMonth(viewDate.getMonth() + 1);
            renderCalendar();
        });
        container.querySelectorAll('.datepicker-day:not(.other-month)').forEach(dayEl => {
            dayEl.addEventListener('click', () => onSelect(dayEl.dataset.date));
        });
    };

    renderCalendar();
    return container;
}

/**
 * Cria o conteúdo para um pop-up de seletor de tempo (timepicker).
 * @param {string} initialTime - A hora inicial no formato 'HH:MM'.
 * @param {Function} onSelect - Callback chamado quando uma hora é selecionada.
 * @returns {HTMLElement} O elemento do pop-up de seletor de tempo.
 */
function createTimePickerPopup(initialTime, onSelect) {
    const container = document.createElement('div');
    container.className = 'popup-content custom-timepicker-container';

    let [h, m] = initialTime && initialTime !== 'FECHADO' ? initialTime.split(':').map(Number) : [new Date().getHours(), new Date().getMinutes()];
    if (isNaN(h) || isNaN(m)) [h, m] = [new Date().getHours(), new Date().getMinutes()];

    let currentHour = h;
    let currentMinute = m;

    container.innerHTML = `
        <div class="timepicker-header">Selecionar Horário</div>
        <div class="timepicker-body-wrapper">
            <div class="timepicker-body">
                <div class="timepicker-selection-indicator"></div>
                <div id="hours-scroller" class="timepicker-scroller">
                    <div class="timepicker-scroller-content">
                        ${Array.from({ length: 24 }, (_, i) => `<div class="timepicker-item" data-value="${i}">${String(i).padStart(2, '0')}</div>`).join('')}
                    </div>
                </div>
                <div class="timepicker-separator">:</div>
                <div id="minutes-scroller" class="timepicker-scroller">
                    <div class="timepicker-scroller-content">
                        ${Array.from({ length: 60 }, (_, i) => `<div class="timepicker-item" data-value="${i}">${String(i).padStart(2, '0')}</div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
        <div class="timepicker-actions">
            <button id="timepicker-cancel">Cancelar</button>
            <button id="timepicker-ok" class="primary">OK</button>
            <button id="timepicker-closed" class="danger">Fechado</button>
        </div>`;

    const hoursScroller = container.querySelector('#hours-scroller');
    const minutesScroller = container.querySelector('#minutes-scroller');
    const itemHeight = 40;
    let scrollTimeout;

    function setupScroller(scroller, initialValue, type) {
        setTimeout(() => { scroller.scrollTop = initialValue * itemHeight; }, 0);

        scroller.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const selectedIndex = Math.round(scroller.scrollTop / itemHeight);
                scroller.scrollTo({ top: selectedIndex * itemHeight, behavior: 'smooth' });
                if (type === 'hours') currentHour = selectedIndex;
                else currentMinute = selectedIndex;
            }, 150);
        });
    }

    setupScroller(hoursScroller, currentHour, 'hours');
    setupScroller(minutesScroller, currentMinute, 'minutes');

    container.querySelector('#timepicker-ok').onclick = () => {
        onSelect(`${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`);
        closePopup();
    };
    container.querySelector('#timepicker-closed').onclick = () => {
        onSelect('FECHADO');
        closePopup();
    };
    container.querySelector('#timepicker-cancel').onclick = () => closePopup();

    return container;
}

/**
 * Função principal exportada. Cria e injeta um input customizado em um elemento 'wrapper'.
 * @param {'select'|'date'|'time'} type - O tipo de input a ser criado.
 * @param {HTMLElement} wrapper - O elemento container onde o input será renderizado.
 * @param {Array<object>|null} options - As opções (necessário para o tipo 'select').
 * @param {string} selectedValue - O valor inicial do input.
 * @param {Function|null} [onChangeCallback=null] - Função a ser chamada quando o valor muda.
 */
export function createCustomInput(type, wrapper, options, selectedValue, onChangeCallback = null) {
    const inputId = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const icon = type === 'date'
        ? `<svg class="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
        : type === 'time'
        ? `<svg class="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        : `<svg class="arrow h-5 w-5 text-muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`;

    let displayValue = selectedValue;
    if (type === 'select' && options) {
        const selectedOption = options.find(opt => opt.value === selectedValue);
        displayValue = selectedOption ? selectedOption.label : (options.length > 0 ? options[0].label : '--');
    }

    wrapper.innerHTML = `
        <div class="custom-input" id="${inputId}">
            <span class="truncate">${displayValue || '--'}</span>
            ${icon}
        </div>`;
    wrapper.dataset.selectedValue = selectedValue;

    const trigger = wrapper.querySelector(`#${inputId}`);
    trigger.addEventListener('click', () => {
        if (trigger.classList.contains('disabled')) return;

        let popupContent;
        if (type === 'select') {
            popupContent = createSelectPopup(options, wrapper.dataset.selectedValue, (newValue, newLabel) => {
                wrapper.dataset.selectedValue = newValue;
                trigger.querySelector('span').textContent = newLabel;
                if (onChangeCallback) onChangeCallback(newValue);
                closePopup();
            });
        } else if (type === 'date') {
            popupContent = createDatePickerPopup(wrapper.dataset.selectedValue, (newDate) => {
                wrapper.dataset.selectedValue = newDate;
                trigger.querySelector('span').textContent = newDate;
                if (onChangeCallback) onChangeCallback(newDate);
                closePopup();
            });
        } else if (type === 'time') {
            popupContent = createTimePickerPopup(wrapper.dataset.selectedValue, (newTime) => {
                wrapper.dataset.selectedValue = newTime;
                trigger.querySelector('span').textContent = newTime;
                if (onChangeCallback) onChangeCallback(newTime);
                // O timepicker já tem seu próprio botão de fechar.
            });
        }

        if (popupContent) {
            openPopup(popupContent);
        }
    });
}
