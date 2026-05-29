import { IEvents } from '../base/Events';
import { Form } from './Form';
import { IContactsFormState } from './OrderForm';

export class ContactsForm extends Form<IContactsFormState> { // дочерний класс для формы контактов, наследуемся от базового класса Form
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // инициализируем общий функционал из класса Form
        this.container.name = 'contacts';
    }
}