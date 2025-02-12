document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            const itemsContainer = document.querySelector(".items");
            itemsContainer.innerHTML = ""; // Clear existing items

            data.forEach(dessert => {
                const itemHTML = `
                    <div class="item">
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
            itemImages.forEach((item) => {
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

                    // Create quantity controls
                    const added = document.createElement('div');
                    added.setAttribute('class', 'added');

                    const mincircle = document.createElement('div');
                    mincircle.setAttribute('class', 'minus');

                    const minIcon = document.createElement('img');
                    minIcon.setAttribute('src', './assets/images/icon-decrement-quantity.svg');

                    const quantity = document.createElement('span');
                    quantity.setAttribute('class', 'quantity');
                    quantity.textContent = 1; // Default quantity

                    const maxcircle =document.createElement('div');
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
                        }
                    });

                    plusIcon.addEventListener('click', () => {
                        let currentQuantity = parseInt(quantity.textContent);
                        quantity.textContent = currentQuantity + 1;
                    });
                });
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});