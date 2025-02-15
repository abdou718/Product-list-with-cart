document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const itemsContainer = document.querySelector(".items");
            itemsContainer.innerHTML = ""; // Clear existing items

            data.forEach((dessert, index) => {
                const itemHTML = `
                    <div class="item" data-name="${dessert.name}"> <!-- Add data-name attribute -->
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

            // Add "Add to Cart" button to each item
            const itemImages = document.querySelectorAll('.item__image');
            itemImages.forEach((item, index) => {
                const addCart = document.createElement('button');
                addCart.setAttribute('class', 'addcart');

                const addIcon = document.createElement('img');
                addIcon.setAttribute('src', './assets/images/icon-add-to-cart.svg');
                const addCartText = document.createTextNode('Add to cart');

                addCart.appendChild(addIcon);
                addCart.appendChild(addCartText);

                // Append the button to the current item's image container
                item.appendChild(addCart);

                // Add click event to the "Add to Cart" button
                addCart.addEventListener('click', () => {
                    // Hide the "Add to Cart" button
                    addCart.style.display = 'none';

                    // Check if the quantity controls already exist
                    let added = item.querySelector('.added');
                    if (!added) {
                        // Create quantity controls
                        added = document.createElement('div');
                        added.setAttribute('class', 'added');

                        const mincircle = document.createElement('div');
                        mincircle.setAttribute('class', 'minus');

                        const minIcon = document.createElement('img');
                        minIcon.setAttribute('src', './assets/images/icon-decrement-quantity.svg');

                        const quantity = document.createElement('span');
                        quantity.setAttribute('class', 'quantity');
                        quantity.textContent = 1; // Default quantity

                        const maxcircle = document.createElement('div');
                        const plusIcon = document.createElement('img');
                        plusIcon.setAttribute('src', './assets/images/icon-increment-quantity.svg');
                        maxcircle.setAttribute('class', 'plus');

                        // Append elements
                        mincircle.appendChild(minIcon);
                        maxcircle.appendChild(plusIcon);
                        added.appendChild(mincircle);
                        added.appendChild(quantity);
                        added.appendChild(maxcircle);

                        // Append quantity controls to the item
                        item.appendChild(added);

                        // Add event listeners for quantity buttons
                        mincircle.addEventListener('click', () => {
                            let currentQuantity = parseInt(quantity.textContent);
                            if (currentQuantity > 1) {
                                quantity.textContent = currentQuantity - 1;
                                updateCartItem(data[index], currentQuantity - 1);
                            }
                        });

                        maxcircle.addEventListener('click', () => {
                            let currentQuantity = parseInt(quantity.textContent);
                            quantity.textContent = currentQuantity + 1;
                            updateCartItem(data[index], currentQuantity + 1);
                        });
                    }

                    // Add the item to the cart
                    addToCart(data[index], 1, item); // Pass the product item
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});

function addToCart(dessert, quantity, item) {
    const yourcart = document.querySelector('.your-cart');
    const cartempty = document.querySelector('.cart-empty');

    cartempty.style.display = 'none'; // Hide "empty cart" message

    let isItemExist = document.querySelector(`.cart-item[data-name="${dessert.name}"]`);
    if (isItemExist) {
        let quantityItem = isItemExist.querySelector('.cart-item__quantity');
        let totalItem = isItemExist.querySelector('.cart-item__total');
        let newQuantity = parseInt(quantityItem.innerText.replace('x', '')) + quantity;

        quantityItem.innerText = `x${newQuantity}`;
        totalItem.innerText = `$${(newQuantity * dessert.price).toFixed(2)}`;
        return;
    }

    // Create new cart item
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-name', dessert.name);
    cartItem.innerHTML = `
        <span class="cart-item__name">${dessert.name}</span>
        <span class="cart-item__quantity">x${quantity}</span>
        <span class="cart-item__price">$${dessert.price.toFixed(2)}</span>
        <span class="cart-item__total">$${(quantity * dessert.price).toFixed(2)}</span>
        <div class="cart-delete">
            <img src="./assets/images/icon-remove-item.svg" alt="Remove item">
        </div>
    `;

    // Event listener to remove item
    cartItem.querySelector('.cart-delete').addEventListener('click', () => {
        yourcart.removeChild(cartItem);

        // Reset the product item's state
        const productItem = document.querySelector(`.item[data-name="${dessert.name}"]`);
        if (productItem) {
            const addCart = productItem.querySelector('.addcart');
            const added = productItem.querySelector('.added');

            if (addCart) addCart.style.display = 'block'; // Show "Add to cart" button
            if (added) added.remove(); // Remove the quantity controls
        }

        if (yourcart.children.length === 1) {
            cartempty.style.display = 'flex'; // Show "empty cart" message again
        }
    });

    yourcart.appendChild(cartItem);
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
}