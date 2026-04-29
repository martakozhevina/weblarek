import { IBuyer, TPayment } from "../../../types";

export class BuyerModel {
    protected _data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };
    
    constructor() {}

    setData(field: keyof IBuyer, value: string | TPayment): void { // общ метод ждя сохр одного поля
        if (field === 'payment') {
            this._data.payment = value as TPayment
        } else {
            this._data[field] = value as string;
        }
    }

    getData(): IBuyer { //получ всех данных покупателя
        return { ...this._data };
    }

    clearData(): void { //очист данных покупателя
        this._data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
    }

    validate(): Partial<Record<keyof IBuyer, string>> { //валидация данных покупателя, возвращает объект с ошибками
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this._data.email) {
            errors.email = 'Введите email';
        }
        if (!this._data.phone) {
            errors.phone = 'Введите телефон';
        }
        if (!this._data.address) {
            errors.address = 'Введите адрес';
        }

        return errors;
    }
}