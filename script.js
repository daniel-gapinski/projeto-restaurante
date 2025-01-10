const menu = document.getElementById("menu");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartBtn = document.getElementById("cart-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");

let cart = [];

cartBtn.addEventListener("click", () => {
    updateCartModal(); //Atualizar o carrinho toda vez que ele é aberto
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", (event) => {
    //console.log(event)
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    } else if (event.target === closeModalBtn) {
        cartModal.style.display = "none";
    }
});

menu.addEventListener("click", (event) => {
    //console.log(event.target);
    //Closest verificar se existe uma classe ou um ID especificado no elemento filho ou no elemento pai, porque neste item, há um icone dentro do botao, e precisa englobar todo o botao para funcionar o evento 
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        //Pegar os atributos do produto que foi clicado
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //Adicionar item ao carrinho
        addToCart(name, price);
    }
});

//Função para adicionar no carrinho
function addToCart(name, price) {
    //Verificar se o item já existe na lista antes de adicionar
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });

    };
    updateCartModal();
};

//Atualiza carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        //console.log(item);
        const cartItemElement = document.createElement('div');

        cartItemElement.innerHTML = `
        <div class="flex justify-between border-b mb-3 py-2">
            <div class="text-sm">
                <p>${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${item.price.toFixed(2)}</p>
            </div>

            <div class="flex justify-center items-center">
                <button class="text-red-500 text-sm remove-from-cart-btn" data-name="${item.name}"> 
                    Remover 
                </button>
            </div>
    
        </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);

    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency',
        currency: 'BRL',
    });

    cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        //console.log(name);
        removeItemCart(name);
    }
});

//Função para remover item
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];
        //console.log(item);

        //Pega a posição do item na lista e diminui a quantidade se ela forma maior que 1
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        //Pega a posição do item na lista e o remove dela quando a quantidade for igual a 1
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value; // .value pega o valor de dentro do input

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    };
});

//Finalizar pedido
checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "O restaurante está fechado! Funcionamento das 18h às 22h",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            //onClick: function(){} // Callback after click
          }).showToast();
          return;
    }
    if(cart.length === 0) {
        return;
    }
    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    //Enviar pedido para o whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("");

    //console.log(cartItems);
    const message = encodeURIComponent(cartItems);
    const phone = "42991058986";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    //Limpar carrinho
    cart = [];
    updateCartModal();

});

//Veridicar hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //true
};
const isOpen = checkRestaurantOpen();
if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}