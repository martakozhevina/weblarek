import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';
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

export class CardCatalog extends Card { // дочерний класс для карточки в каталоге, наследуемся от базового класса Card
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) { // в конструктор передаем объект с коллбеком для клика по карточке, который будет открывать превью товара
        super(container); // вызов родительского конструктора Card

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) { // 
            container.addEventListener('click', actions.onClick); // ставим слушатель клика на всю карточку, чтобы открывать превью при клике в любом месте карточки
        }
    }

    set category(value: string) { // при установке категории мы не только меняем текст, но и класс элемента, чтобы отображать цвет категории
            this.categoryElement.textContent = value;
            const classesToRemove = Object.values(categoryMap); // удаляем все возможные классы категорий, чтобы не было конфликтов классов при смене категории
            this.categoryElement.classList.remove(...classesToRemove); // удаляем все классы, которые могут быть на элементе категории
            
            const modifier = categoryMap[value as keyof typeof categoryMap]; // получаем класс для текущей категории из мапы, которая сопоставляет название категории с классом
            if (modifier) {
                this.categoryElement.classList.add(modifier); // добавляем класс для текущей категории, если он есть в мапе
            }
    }

    set image(value: string) { // при установке картинки используем метод из базового класса, который устанавливает src и alt для картинки, а также обрабатывает ошибку загрузки картинки
        this.setImage(this.imageElement, value, this.titleElement?.textContent);
    }
}

export class CardPreview extends Card { // дочерний класс для карточки в превью товара, наследуемся от базового класса Card
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container); // вызов родительского конструктора Card

        // находим уникальные для этого темплейта элементы
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) { // ставим слушатель клика на кнопку, чтобы открывать превью при клике по кнопке
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
            this.categoryElement.textContent = value;
            const classesToRemove = Object.values(categoryMap);
            this.categoryElement.classList.remove(...classesToRemove);
            
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                this.categoryElement.classList.add(modifier);
            }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement?.textContent);
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }
}

export class CardBasket extends Card { // дочерний класс для карточки в корзине, наследуемся от базового класса Card
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onDelete: () => void }) {
        super(container); // вызов родительского конструктора Card

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) { // ставим слушатель клика на кнопку удаления товара из корзины, который будет отправлять событие в презентер для удаления товара из модели корзины
            this.deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) { // для отображения порядкового номера товара в корзине, который будет устанавливаться презентером при рендере корзины
        this.indexElement.textContent = String(value);
    }
}