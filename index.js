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
        })
        .catch(error => console.error("Error fetching data:", error));
});
