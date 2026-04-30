import { IBuyer, TPayment, FormErrors } from "../../types";

export class BuyerModel {
    protected data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };
    
    constructor() {}

    setData(field: keyof IBuyer, value: string): void { // общ метод ждя сохр одного поля
        if (field === 'payment') {
            this.data.payment = value as TPayment
        } else {
            this.data[field] = value as string;
        }
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