import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccess { // интерфейс данных для компонента Success, который будет отображать итоговую списанную сумму после оформления заказа
    total: number;
}

export class Success extends Component<ISuccess> { // класс для отображения сообщения об успешном оформлении заказа, принимает в дженерик интерфейс данных для отображения итоговой списанной суммы
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    /**
     * Конструктор класса Success
     * @param container — элемент из шаблона #success
     * @param actions — объект с обработчиком клика на закрытие
     */
    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        // устанавливаем слушатель один раз в конструкторе
        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) { // сеттер для отображения итоговой списанной суммы, который будет вызываться презентером при открытии компонента Success после оформления заказа
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}