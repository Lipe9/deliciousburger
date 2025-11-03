// Função para avançar para a próxima etapa
function nextStep() {
    const addressForm = document.getElementById('address-form');
    if (addressForm.checkValidity()) {
        document.querySelector('.form-section').classList.add('hidden');
        document.getElementById('payment-section').classList.remove('hidden');
    } else {
        addressForm.reportValidity();
    }
}

// Função para voltar à etapa anterior
function prevStep() {
    document.getElementById('payment-section').classList.add('hidden');
    document.querySelector('.form-section').classList.remove('hidden');
}

// Função para selecionar método de pagamento
function selectPayment(method) {
    document.getElementById(method).checked = true;
    // Remove selected class from all
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    // Add to selected
    document.querySelector(`label[for="${method}"]`).parentElement.classList.add('selected');
    togglePaymentFields(method);
}

// Alternar campos de pagamento
function togglePaymentFields(method) {
    document.getElementById('cartao-fields').classList.add('hidden');
    document.getElementById('pix-fields').classList.add('hidden');
    document.getElementById('boleto-fields').classList.add('hidden');

    if (method === 'cartao') {
        document.getElementById('cartao-fields').classList.remove('hidden');
    } else if (method === 'pix') {
        document.getElementById('pix-fields').classList.remove('hidden');
    } else if (method === 'boleto') {
        document.getElementById('boleto-fields').classList.remove('hidden');
    }
}

// Event listener para mudança de radio
document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', function() {
        togglePaymentFields(this.value);
    });
});

// Preencher resumo do pedido
function populateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const orderItems = document.getElementById('order-items');
    const totalPrice = document.getElementById('total-price');
    let total = 0;

    orderItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        let itemText = `${item.produto}`;
        if (item.opcoes && Object.keys(item.opcoes).length > 0) {
            const options = [];
            for (const [key, value] of Object.entries(item.opcoes)) {
                if (Array.isArray(value)) {
                    options.push(`${key}: ${value.join(', ')}`);
                } else {
                    options.push(`${key}: ${value}`);
                }
            }
            itemText += ` (${options.join('; ')})`;
        }
        li.innerHTML = `<span>${itemText}</span><span>R$ ${item.preco.toFixed(2)}</span>`;
        orderItems.appendChild(li);
        total += item.preco;
    });

    totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para buscar CEP
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    console.log('CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    populateOrderSummary();
    // Set initial selected payment
    selectPayment('cartao');
});
