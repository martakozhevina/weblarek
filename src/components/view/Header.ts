import { Component } from '../base/Component'; // базовый класс для всех компонентов
import { IEvents } from '../base/Events';     // интерфейс брокера событий EventEmitter
import { ensureElement } from '../../utils/utils'; // утилита для безопасного получения элемента из DOM, которая выбросит ошибку, если элемент не найден

export interface IHeaderData { // интерфейс данных, которые принимает компонент для отображения
    counter: number;
}

export class Header extends Component<IHeaderData> { // передаем наши данные в дженерик
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    /**
     * Конструктор класса
     * @param container — корневой элемент шапки (селектор .header)
     * @param events — ьрокер событий
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // находим кнопку корзины и элемент счётчика
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        // ставим слушатель клика на кнопку корзины
        this.basketButton.addEventListener('click', () => {
        // событие, которое поймает и обработает презентер
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) { // сеттер для обновления счётчика товаров в корзине
        // приводим к строке, чтобы отобразить число в HTML
        this.counterElement.textContent = String(value);
    }
}
