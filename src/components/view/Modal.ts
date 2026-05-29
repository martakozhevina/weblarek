import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IModalData { // интерфейс данных для модального окна
    content: HTMLElement | null; // контент для отображения внутри модалки, может быть null, если модалка закрыта и контент нужно очистить
}

export class Modal extends Component<IModalData> { // класс для модального окна, принимает в дженерик интерфейс данных для модалки
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    /**
     * Конструктор класса Modal
     * @param container — корневой элемент модалки селектор #modal-container
     * @param events — ьрокер событий для уведомления Презентера
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // находим кнопку закрытия и контейнер для динамического контента
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

       // находим внутреннее белое окошко для контроля всплытия кликов
        const modalContainer = ensureElement<HTMLElement>('.modal__container', this.container);

        // навешиваем слушатели событий для закрытия модалки
        this.closeButton.addEventListener('click', this.close.bind(this)); // клик по кнопке-крестику
        this.container.addEventListener('click', this.close.bind(this));   // клик по оверлею

        // предотвращаем закрытие окна при клике на само белое модальное окошко
        modalContainer.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) { // сеттер для динамического контента в модалке, который будет устанавливаться презентером при открытии модалки
        this.contentElement.replaceChildren(value || document.createDocumentFragment());
    }

    open(): void { // метод для открытия модального окна, который будет вызываться презентером при открытии модалки
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void { // метод для закрытия модального окна, который будет вызываться при клике по оверлею или кнопке закрытия
        this.container.classList.remove('modal_active');
        // очищаем контент при закрытии, чтобы старые карточки не мелькали при следующем открытии
        this.content = null; 
        this.events.emit('modal:close');
    }
}