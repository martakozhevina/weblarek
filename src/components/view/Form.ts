import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// интерфейс состояния формы, общий для всей иерархии
export interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T extends IFormState = IFormState> extends Component<T> { // базовый класс для всех форм, принимает в дженерик интерфейс состояния формы
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
}