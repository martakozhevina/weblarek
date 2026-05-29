import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasketView { // интерфейс данных для отображения корзины
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> { // класс для отображения корзины, принимает в дженерик интерфейс данных для корзины
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    /**
     * Конструктор класса Basket
     * @param container — элемент из шаблона #basket
     * @param events — брокер событий для связи с Презентером
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        // находим элементы для отображения списка товаров, общей стоимости и кнопку оформления заказа
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // устанавливаем слушатель в конструкторе
        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open'); // сигнал Презентеру открыть первую форму заказа
        });

        // по умолчанию, пока данных нет, корзина считается пустой
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listElement.replaceChildren(...items);
            this.buttonElement.disabled = false; // Устанавливаем кнопку в активное состояние
        } else {
            // Если в стартере под пустую корзину заложен тег в самом шаблоне, 
            // то очищаем список и блокируем кнопку.
            this.listElement.replaceChildren();
            this.buttonElement.disabled = true;
        }
    }

    set total(value: number) { // сеттер для отображения общей стоимости в корзине, который будет вызываться презентером при изменении данных в модели
            this.priceElement.textContent = `${value} синапсов`;
    }
}