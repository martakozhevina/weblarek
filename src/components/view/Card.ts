import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// интерфейс данных карточки
export interface ICardData {
    id: string; // уникальный идентификатор товара, нужен для всех карточек
    title: string;
    category?: string;
    description?: string;
    image?: string;
    price: number | null;
    index?: number; // нужен только для карточки в корзине, чтобы отображать порядковый номер товара в корзине
}

export class Card extends Component<ICardData> { // базовый класс для всех карточек, принимает в дженерик интерфейс данных карточки
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
            this.priceElement.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
}