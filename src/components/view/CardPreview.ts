import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { categoryMap } from '../../utils/constants';

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
