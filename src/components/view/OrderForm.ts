import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Form, IFormState } from './Form';
import { TPayment } from '../../types';

// 1. Интерфейс состояния для формы заказа (Шаг 1)
export interface IOrderFormState extends IFormState {
    payment: TPayment | null;
    address: string;
}

// 2. Интерфейс состояния для формы контактов (Шаг 2)
export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

export class OrderForm extends Form<IOrderFormState> {  // дочерний класс для формы заказа, наследуемся от базового класса Form
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // инициализируем общий функционал из класса Form
        this.container.name = 'order';
        // находим уникальные элементы формы заказа
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        // навешиваем слушатели на кнопки выбора оплаты 
        this.cardButton.addEventListener('click', () => {
            this.events.emit('order.payment:change', { 
                field: 'payment', 
                value: 'card' 
            }); 
        });

        this.cashButton.addEventListener('click', () => {
                this.payment = 'cash'; // визуально переключаем класс активности
                this.events.emit('order.payment:change', { field: 'payment', 
        value: 'cash' }); // уведомляем Презентер
        });
    }

   set payment(value: 'card' | 'cash' | null) { 
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
}
}

