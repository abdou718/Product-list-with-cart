document.addEventListener("DOMContentLoaded", () => {
    let dessertNumber = document.querySelector(".DessertsNumbers");
    let howMany = document.querySelector(".howMany");
    var NumbersOfCart = 0;
    var totalNumber = 0;
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const itemsContainer = document.querySelector(".items");
            itemsContainer.innerHTML = ""; // Clear existing items

            data.forEach((dessert, index) => {
                const itemHTML = `
                    <div class="item" data-name="${dessert.name}">
                        <div class="item__image">
                            <img src="${dessert.image.desktop}" alt="${dessert.name}">
                        </div>
                        <div class="item__info">
                            <span class="item__category">${dessert.category}</span>
                            <span class="item__name">${dessert.name}</span>
                            <span class="item__price">$${dessert.price.toFixed(2)}</span>
                        </div>
                    </div>
                `;
                itemsContainer.innerHTML += itemHTML;
            });

            const itemImages = document.querySelectorAll('.item__image');
            itemImages.forEach((item, index) => {
                const addCart = document.createElement('button');
                addCart.setAttribute('class', 'addcart');

                const addIcon = document.createElement('img');
                addIcon.setAttribute('src', './assets/images/icon-add-to-cart.svg');
                const addCartText = document.createTextNode('Add to cart');

                addCart.appendChild(addIcon);
                addCart.appendChild(addCartText);

                item.appendChild(addCart);

                addCart.addEventListener('click', () => {
                    NumbersOfCart++;
                    howMany.textContent = NumbersOfCart;
                    dessertNumber.style.display = "inline-block";

                    addCart.style.display = 'none';
                    let added = item.querySelector('.added');
                    if (!added) {
                        added = document.createElement('div');
                        added.setAttribute('class', 'added');

                        const mincircle = document.createElement('div');
                        mincircle.setAttribute('class', 'minus');

                        const minIcon = document.createElement('img');
                        minIcon.setAttribute('src', './assets/images/icon-decrement-quantity.svg');

                        const quantity = document.createElement('span');
                        quantity.setAttribute('class', 'quantity');
                        quantity.textContent = 1;

                        const maxcircle = document.createElement('div');
                        const plusIcon = document.createElement('img');
                        plusIcon.setAttribute('src', './assets/images/icon-increment-quantity.svg');
                        maxcircle.setAttribute('class', 'plus');

                        mincircle.appendChild(minIcon);
                        maxcircle.appendChild(plusIcon);
                        added.appendChild(mincircle);
                        added.appendChild(quantity);
                        added.appendChild(maxcircle);

                        item.appendChild(added);

                        mincircle.addEventListener('click', () => {
                            let currentQuantity = parseInt(quantity.textContent);
                            if (currentQuantity > 1) {
                                quantity.textContent = currentQuantity - 1;
                                updateCartItem(data[index], currentQuantity - 1);
                                NumbersOfCart--;
                                howMany.textContent = NumbersOfCart;
                            } else {
                                // If quantity is reduced to 0, remove the item from the cart
                                NumbersOfCart--;
                                howMany.textContent = NumbersOfCart;

                                const cartItem = document.querySelector(`.cart-item[data-name="${data[index].name}"]`);
                                if (cartItem) cartItem.remove();

                                addCart.style.display = "block";
                                added.remove();

                                if (NumbersOfCart === 0) {
                                    dessertNumber.style.display = "none";
                                    document.querySelector('.cart-empty').style.display = 'flex';
                                    document.querySelector('.TotalPrice').style.display = 'none';
                                }
                            }
                        });

                        maxcircle.addEventListener('click', () => {
                            let currentQuantity = parseInt(quantity.textContent);
                            quantity.textContent = currentQuantity + 1;
                            updateCartItem(data[index], currentQuantity + 1);
                            NumbersOfCart++;
                            howMany.textContent = NumbersOfCart;
                        });
                    }
                    document.querySelector('.TotalPrice').style.display = 'block';
                    addToCart(data[index], 1, item, howMany.textContent);
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});

function addToCart(dessert, quantity, item, CartNumbers) {
    const yourcart = document.querySelector('.your-cart');
    const cartempty = document.querySelector('.cart-empty');
    const dessertNumber = document.querySelector(".DessertsNumbers");
    const howMany = document.querySelector(".howMany");

    cartempty.style.display = 'none';

    let isItemExist = document.querySelector(`.cart-item[data-name="${dessert.name}"]`);
    if (isItemExist) {
        let quantityItem = isItemExist.querySelector('.cart-item__quantity');
        let totalItem = isItemExist.querySelector('.cart-item__total');
        let newQuantity = parseInt(quantityItem.innerText.replace('x', '')) + quantity;

        quantityItem.innerText = `x${newQuantity}`;
        totalItem.innerText = `$${(newQuantity * dessert.price).toFixed(2)}`;
        updateTotalNumber();
        return;
    }

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-name', dessert.name);
    cartItem.innerHTML = `
        <div class="cart-details">
            <span class="cart-item__name">${dessert.name}</span>
            <div class="item-detail">
                <span class="cart-item__quantity">x${quantity}</span>
                <span class="cart-item__price">$${dessert.price.toFixed(2)}</span>
                <span class="cart-item__total">$${(quantity * dessert.price).toFixed(2)}</span>
            </div>
        </div>
        <div class="cart-delete">
            <img src="./assets/images/icon-remove-item.svg" alt="Remove item">
        </div>
    `;

    cartItem.querySelector('.cart-delete').addEventListener('click', () => {
        let quantityToRemove = parseInt(cartItem.querySelector('.cart-item__quantity').innerText.replace('x', ''));
        NumbersOfCart -= quantityToRemove;
        howMany.textContent = NumbersOfCart;

        yourcart.removeChild(cartItem);

        const productItem = document.querySelector(`.item[data-name="${dessert.name}"]`);
        if (productItem) {
            const addCart = productItem.querySelector('.addcart');
            const added = productItem.querySelector('.added');

            if (addCart) addCart.style.display = 'block';
            if (added) added.remove();
        }

        if (yourcart.children.length === 0) {
            cartempty.style.display = 'flex';
            dessertNumber.style.display = 'none';
            NumbersOfCart = 0;
        }

        updateTotalNumber();
    });

    yourcart.appendChild(cartItem);
    updateTotalNumber();
}

function updateCartItem(dessert, quantity) {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(cartItem => {
        const itemName = cartItem.querySelector('.cart-item__name').textContent;
        if (itemName === dessert.name) {
            cartItem.querySelector('.cart-item__quantity').textContent = `x${quantity}`;
            cartItem.querySelector('.cart-item__total').textContent = `$${(quantity * dessert.price).toFixed(2)}`;
        }
    });
    updateTotalNumber();
}

function updateTotalNumber() {
    const cartItems = document.querySelectorAll('.cart-item');
    totalNumber = 0;
    cartItems.forEach(cartItem => {
        const itemTotal = parseFloat(cartItem.querySelector('.cart-item__total').textContent.replace('$', ''));
        totalNumber += itemTotal;
    });

    let cartTotal = document.querySelector('.cartTotal');
    if (!cartTotal) {
        cartTotal = document.createElement('div');
        cartTotal.classList.add('cartTotal');
        document.querySelector('.TotalPrice').appendChild(cartTotal);

        let carNeut = document.createElement('span');
        carNeut.classList.add('carNeut');
        carNeut.innerHTML = `
            <img src="/product list with cart/assets/images/icon-carbon-neutral.svg" alt ="carbon-neutral">
            <span>&nbsp;This is a <strong>carbon-neutral</strong> delivery</span>
        `;
        document.querySelector('.TotalPrice').appendChild(carNeut);

        let confirme = document.createElement('button');
        confirme.classList.add('confirme');
        confirme.innerHTML = `
            <span>Confirm Order</span>
        `;
        document.querySelector('.TotalPrice').appendChild(confirme);

        confirme.addEventListener('click', () => {
            const cartItems = document.querySelectorAll('.cart-item');
            const desserts = Array.from(cartItems).map(cartItem => {
                const name = cartItem.querySelector('.cart-item__name').textContent;
                const quantity = cartItem.querySelector('.cart-item__quantity').textContent.replace('x', '');
                const price = cartItem.querySelector('.cart-item__price').textContent.replace('$', '');
                const total = cartItem.querySelector('.cart-item__total').textContent.replace('$', '');
                return { name, quantity, price, total };
            });
            orderconfirmed(desserts);
        });
    }

    cartTotal.innerHTML = `
        <span>Order Total</span>
        <span class="TotalNumber">$${totalNumber.toFixed(2)}</span>
    `;
}

function orderconfirmed(desserts) {
    const orderconfirmed = document.querySelector('.OrderConfimed');
    orderconfirmed.innerHTML = `
        <img src="/product list with cart/assets/images/icon-order-confirmed.svg" alt="order-confirmed" id="order-confirmed">
        <span class="Orderconfirme-title">Order Confirmed</span>
        <span class="thanks">We hope you enjoy your food</span>
        <div class="order-confirmed-list"></div>
    `;
    const orderconfirmedList = document.querySelector('.order-confirmed-list');
    desserts.forEach(dessert => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
            <span class="cart-item__name">${dessert.name}</span>
            <span class="cart-item__quantity">x${dessert.quantity}</span>
            <span class="cart-item__price">$${dessert.price}</span>
            <span class="cart-item__total">$${dessert.total}</span>
        `;
        orderconfirmedList.appendChild(item);
    });

    orderconfirmed.style.display = 'flex';
    orderconfirmed.classList.add('show');
    document.body.classList.add('order-active');

}