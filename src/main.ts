import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiWebLarek } from './components/api/ApiWebLarek';
import { API_URL, CDN_URL } from './utils/constants';

// модели данных
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// компоненты представления (View)
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

// интерфейсы данных
import { IProduct, IBuyer, ICardData } from './types';
import { cloneTemplate } from './utils/utils';

// 1. ИНИЦИАЛИЗАЦИЯ ИНФРАСТРУКТУРЫ, МОДЕЛЕЙ И ГЛОБАЛЬНЫХ КОМПОНЕНТОВ СТРАНИЦЫ

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new ApiWebLarek(baseApi);

// модели (передаем брокер событий)
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// контейнеры верхнего уровня на странице
const pageHeaderElement = document.querySelector('.header') as HTMLElement;
const pageGalleryElement = document.querySelector('.gallery') as HTMLElement;
const modalRootElement = document.querySelector('#modal-container') as HTMLElement;

// находим шаблоны (templates) в DOM
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// инициализируем глобальные View-компоненты страницы
const headerComponent = new Header(pageHeaderElement, events);
const galleryComponent = new Gallery(pageGalleryElement);
const modalComponent = new Modal(modalRootElement, events);
const basketComponent = new Basket(cloneTemplate(basketTemplate), events);
const orderFormComponent = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsFormComponent = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successElement = cloneTemplate(successTemplate);
const successComponent = new Success(successElement, {
    onClick: () => {
        modalComponent.close();
    }
});

const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
const cardPreviewComponent = new CardPreview(cardPreviewElement, {
    onClick: () => {
        // Получаем текущий открытый товар напрямую из модели каталога
        const previewItem = catalogModel.getPreview();
        if (!previewItem || previewItem.price === null) return;

        // Если товар уже в корзине — удаляем, если нет — добавляем
        if (basketModel.checkInBasket(previewItem.id)) {
            basketModel.removeItem(previewItem.id);
        } else {
            basketModel.addItem(previewItem);
        }
        
        // Генерируем чисто текстовое событие для обновления отображения превью
        events.emit('preview:changed');
    }
});

// 2. ОБРАБОТЧИКИ СОБЫТИЙ МОДЕЛЕЙ ДАННЫХ (РЕАКТИВНЫЙ РЕНДЕР)
// 2.1 Изменение каталога товаров -> Рендерим витрину карточек

events.on('items:changed', (data: { items: IProduct[] }) => {
    const catalogCards = data.items.map((item) => {
        const cardElement = cloneTemplate(cardCatalogTemplate);
        const cardComponent = new CardCatalog(cardElement, {
            onClick: () => events.emit('card:select', item) // Переводим клик во внутреннее событие
        });
        return cardComponent.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
    galleryComponent.render({ catalog: catalogCards });
});

// 2.2 Изменение выбранного товара -> Открываем карточку в модальном окне (Превью)

events.on('preview:changed', () => {
    const previewItem = catalogModel.getPreview(); 
    if (!previewItem) return;

    const isAlreadyInBasket = basketModel.checkInBasket(previewItem.id);
    
    // Формируем текст кнопки
    const buttonText = previewItem.price === null 
        ? 'Не продается' 
        : (isAlreadyInBasket ? 'Удалить' : 'В корзину');

    // Передаем данные через метод render
    const renderedPreview = cardPreviewComponent.render({
        title: previewItem.title,
        image: CDN_URL + previewItem.image,
        price: previewItem.price,
        category: previewItem.category,
        description: previewItem.description,
        buttonText,
        buttonDisabled: previewItem.price === null 
    } as Partial<ICardData>);

    // Открываем модальное окно с готовым содержимым
    modalComponent.render({ content: renderedPreview });
    modalComponent.open();
});

// 2.3 Изменение содержимого корзины -> Обновляем Хедер и состав окна Корзины

events.on('basket:changed', () => {
    // обновляем счетчик на главной странице
    headerComponent.render({ counter: basketModel.getItemCount() });

    // пересобираем строки товаров для компонента корзины
    const basketItemsHtml = basketModel.getItems().map((item, index) => {
        const itemElement = cloneTemplate(cardBasketTemplate);
        const cardBasketComponent = new CardBasket(itemElement, {
            onDelete: () => basketModel.removeItem(item.id)
        });
        return cardBasketComponent.render({
            index: index + 1,
            title: item.title,
            price: item.price
        });
    });

    // отправляем новые элементы и сумму в корзину
    basketComponent.render({
        items: basketItemsHtml,
        total: basketModel.getTotalPrice()
    });
});

// 2.4 Изменение ошибок валидации покупателя -> Управляем доступностью кнопок в формах

events.on('buyer:data-changed', (data: IBuyer) => {
    const errors = buyerModel.validate();
    const { payment, address, email, phone } = errors;
    
    // валидация первой формы оплата и адрес
    const isOrderValid = !payment && !address;
    orderFormComponent.render({
        valid: isOrderValid,
        payment: data.payment, // Передаем актуальный метод оплаты (сбросит или подсветит кнопку)
        address: data.address, // Передаем значение адреса (очистит поле при сбросе модели)
        errors: Object.values({ payment, address }).filter((value): value is string => Boolean(value))
    });

    // валидация второй формы email и телефон
    const isContactsValid = !email && !phone;
    contactsFormComponent.render({
        valid: isContactsValid,
        email: data.email,     // Передаем значение email (очистит поле при сбросе модели)
        phone: data.phone,     // Передаем значение телефона (очистит поле при сбросе модели)
        errors: Object.values({ email, phone }).filter((value): value is string => Boolean(value))
    });
});

// 3. ОБРАБОТЧИКИ СОБЫТИЙ ИНТЕРФЕЙСА (ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ / VIEW EVENTS)

// 3.1 Клик по карточке на витрине -> Меняем состояние модели каталога

events.on('card:select', (item: IProduct) => {
    catalogModel.setPreview(item);
});

// 3.2 Открытие окна корзины (клик по кнопке в шапке)

events.on('basket:open', () => {
    modalComponent.render({ content: basketComponent.render() });
    modalComponent.open();
});

// 3.3 Переход к оформлению шага 1, кнопка "Оформить" в корзине

events.on('order:open', () => {
    buyerModel.clearData(); // Очищаем данные для нового ввода;
    
    modalComponent.render({ content: orderFormComponent.render() }); 
    modalComponent.open();
});

// 3.4 Динамический ввод данных в форму заказа. Способ оплаты или Адрес

events.on(/^order\..*:change$/, (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setData(data.field, data.value);
});

// 3.5 Переход к оформлению шага 2 (сабмит первой формы "Далее")

events.on('order:submit', () => {
    modalComponent.render({ content: contactsFormComponent.render() });
    modalComponent.open();
});

// 3.6 Динамический ввод данных в форму контактов (Email или Телефон)

events.on(/^contacts\..*:change$/, (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setData(data.field, data.value);
});

// 3.7 Финальная отправка заказа (сабмит второй формы "Оплатить")

events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map(item => item.id)
    };

    // отправляем сформированный заказ на сервер через API
    api.postOrder(orderData)
        .then((result) => {
            modalComponent.render({
                content: successComponent.render({ total: result.total })
            });
            
            // полностью сбрасываем состояние приложения после успешной транзакции
            basketModel.clear();
            buyerModel.clearData();
        })
        .catch((err) => {
            console.error('Критическая ошибка оформления заказа:', err);
        });
});

// 4. СТАРТ ПРИЛОЖЕНИЯ (ЗАГРУЗКА ДАННЫХ С СЕРВЕРА)

api.getProducts()
    .then((data) => {
        // запись в модель автоматически стриггерит событие 'items:changed' и отрисует витрину
        catalogModel.setItems(data.items);
    })
    .catch((err) => {
        console.error('Не удалось загрузить каталог товаров при старте:', err);
    });