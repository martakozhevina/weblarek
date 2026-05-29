import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// интерфейс состояния формы, общий для всей иерархии
export interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form extends Component<IFormState> { // базовый класс для всех форм, принимает в дженерик интерфейс состояния формы
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // находим общие элементы для всех форм на сайте
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        // слушатель на ввод данных в любой инпут внутри формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const name = target.name;
            const value = target.value;
            
            // генерируем событие изменения конкретного поля по шаблону
            this.events.emit(`${this.container.name}.${name}:change`, {
                field: name,
                value: value
            });
        });

        // слушатель на сабмит формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            // генерируем событие отправки конкретной формы по её имени ("order:submit" или "contacts:submit")
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    set valid(value: boolean) { // сеттер для управления состоянием кнопки сабмита, который будет вызываться презентером при валидации формы
            this.submitButton.disabled = !value;
    }

    set errors(value: string[]) { // сеттер для отображения ошибок валидации, который будет вызываться презентером при валидации формы  
            this.errorsElement.textContent = value.join(', ');
    }

    clear(): void { // метод для очистки формы, который будет вызываться презентером при успешной отправке формы
        this.container.reset();
    }
}


export class OrderForm extends Form { // дочерний класс для формы заказа, наследуемся от базового класса Form
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // инициализируем общий функционал из класса Form
        this.container.name = 'order';
        // находим уникальные элементы формы заказа
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        // кавешиваем слушатели на кнопки выбора оплаты 
        this.cardButton.addEventListener('click', () => {
                this.payment = 'card'; // визуально переключаем класс активности
                this.events.emit('order.payment:change', { field: 'payment', 
        value: 'card' }); // уведомляем Презентер
        });

        this.cashButton.addEventListener('click', () => {
                this.payment = 'cash'; // визуально переключаем класс активности
                this.events.emit('order.payment:change', { field: 'payment', 
        value: 'cash' }); // уведомляем Презентер
        });
    }

    set payment(value: 'card' | 'cash' | null) { // сеттер для управления визуальным состоянием кнопок оплаты, который будет вызываться презентером при изменении способа оплаты в модели
        // сбрасываем класс активности с обеих кнопок
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');

        // подсвечиваем только выбранную пользователем кнопку
        if (value === 'card') {
            this.cardButton.classList.add('button_alt-active');
        } else if (value === 'cash') {
            this.cashButton.classList.add('button_alt-active');
        }
    }
}


export class ContactsForm extends Form { // дочерний класс для формы контактов, наследуемся от базового класса Form
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // инициализируем общий функционал из класса Form
        this.container.name = 'contacts';
    }
}