export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'online' | 'cash';

export interface IProduct {
  id: string;          // Уникальный идентификатор товара
  description: string; // Описание товара
  image: string;       // Ссылка на изображение
  title: string;       // Название товара
  category: string;    // Категория товара
  price: number | null; // Цена товара (null для бесценных товаров)
}

export interface IBuyer {
  payment: TPayment | null;  // Способ оплаты (онлайн/наличные)
  email: string;      // Электронная почта
  phone: string;      // Номер телефона
  address: string;    // Адрес
}

// Интерфейс для ответа сервера при получении списка товаров
export interface IProductList {
    total: number;    // Общее количество товаров
    items: IProduct[]; // Массив товаров
}

// Интерфейс заказа, который мы отправляем на сервер
export interface IOrder extends IBuyer {
    total: number;     // Финальная сумма
    items: string[];   // Массив ID товаров
}

// Интерфейс ответа сервера при успешном заказе
export interface IOrderResult {
    id: string;        // ID созданного заказа
    total: number;     // Подтвержденная сумма заказа
}

export interface ICardData extends IProduct {
    buttonText?: string;
    buttonDisabled?: boolean;
}

// Тип для ошибок формы
export type FormErrors<T> = Partial<Record<keyof T, string>>;