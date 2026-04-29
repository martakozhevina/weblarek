import './scss/styles.scss';

import { CatalogModel } from './components/base/models/CatalogModel';
import { BasketModel } from './components/base/models/BasketModel';
import { BuyerModel } from './components/base/models/BuyerModel';
import { apiProducts } from './utils/data';

// ТЕСТ КАТАЛОГА
const catalog = new CatalogModel();
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', catalog.getItems());

const firstItem = catalog.getItems()[0];
catalog.setPreview(firstItem);
console.log('Выбранный товар для превью:', catalog.getPreview());

const foundItem = catalog.getItem(firstItem.id);
console.log('Поиск товара по ID:', foundItem?.title === firstItem.title ? 'Успешно' : 'Ошибка');


// ТЕСТ КОРЗИНЫ
const basket = new BasketModel();

basket.addItem(firstItem);
console.log('Товар добавлен в корзину. Количество:', basket.getItemCount());
console.log('Находится ли товар в корзине (ID check):', basket.checkInBasket(firstItem.id));

const secondItem = catalog.getItems()[1];
if (secondItem) basket.addItem(secondItem);
console.log('Общая сумма корзины:', basket.getTotalPrice());

basket.removeItem(firstItem.id);
console.log('После удаления одного товара. Количество:', basket.getItemCount());


// ТЕСТ ДАННЫХ ПОКУПАТЕЛЯ
const buyer = new BuyerModel();

// проверяем валидацию пустой модели
console.log('Ошибки при пустых данных:', buyer.validate());

// заполняем данные частично
buyer.setData('payment', 'online');
buyer.setData('address', 'ул кузнечная 14');
console.log('Данные после частичного заполнения:', buyer.getData());
console.log('Ошибки после частичного заполнения (email и phone должны остаться):', buyer.validate());

// заполняем полностью
buyer.setData('email', 'test@test.rs');
buyer.setData('phone', '+79999999999');
const finalErrors = buyer.validate();
console.log('Ошибки после полного заполнения:', Object.keys(finalErrors).length === 0 ? 'Нет ошибок' : finalErrors);

// ТЕСТ API
import { Api } from './components/base/Api'; // базовый класс Api
import { ApiWebLarek } from './components/base/models/ApiWebLarek';
import { API_URL } from './utils/constants';

// инициализируем базовый API
const baseApi = new Api(API_URL);

// создаем экземпляр ApiWebLarek, передавая в него базовый API
const apiWebLarek = new ApiWebLarek(baseApi);

// выполняем запрос на сервер
apiWebLarek.getProducts()
    .then((data) => {
        // сохраняем полученный массив товаров в каталог
        catalog.setItems(data.items);
        
        // выводим результат в консоль для проверки
        console.log('Товары в модели каталога:', catalog.getItems());
        console.log('Всего товаров получено:', data.total);
    })
    .catch((err) => {
        console.error('Ошибка при получении данных с сервера:', err);
    });