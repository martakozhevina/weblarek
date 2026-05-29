import { IBuyer, TPayment, FormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
    protected data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };
    
    constructor(protected events: IEvents) {}

    setData(field: keyof IBuyer, value: string): void { // общ метод ждя сохр одного поля
        if (field === 'payment') {
            this.data.payment = value as TPayment
        } else {
            this.data[field] = value as string;
        }
        const errors = this.validate(); // при каждом изменении данных выполняем валидацию и сохраняем результат
        this.events.emit('buyer:form-errors', errors); // уведомляем презентер об изменении данных покупателя и передаем результат валидации для управления состоянием формы
    }

    getData(): IBuyer { //получ всех данных покупателя
        return this.data;
    }

    clearData(): void { //очист данных покупателя
        this.data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('buyer:form-errors', {}); // уведомляем презентер об изменении данных покупателя и передаем пустой объект ошибок для сброса состояния формы
    }

    validate(): FormErrors<IBuyer> { //валидация данных покупателя, возвращает объект с ошибками
        const errors: FormErrors<IBuyer> = {};

        if (!this.data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.data.email.trim()) {
            errors.email = 'Введите email';
        }
        if (!this.data.phone.trim()) {
            errors.phone = 'Введите телефон';
        }
        if (!this.data.address.trim()) {
            errors.address = 'Введите адрес';
        }

        return errors;
    }
}