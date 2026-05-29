import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

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