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
function prevStep() {
    document.getElementById('payment-section').classList.add('hidden');
    document.querySelector('.form-section').classList.remove('hidden');
}
// Função para selecionar método de pagamento
function selectPayment(method) {
    document.getElementById(method).checked = true;
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    document.querySelector(`label[for="${method}"]`).parentElement.classList.add('selected');
    togglePaymentFields(method);
}
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
document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', function() {
        togglePaymentFields(this.value);
    });
});
// Função para buscar CEP e calcular frete
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
                    // Calcular frete baseado na cidade
                    calcularFrete(data.localidade);
                } else {
                    console.log('CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    }
});
// Função para calcular frete
function calcularFrete(cidade) {
    let frete = 5.00;
    const cidadesGratis = ['Fortaleza', 'Caucaia'];
    if (cidadesGratis.includes(cidade)) {
        frete = 0.00;
    } else if (cidade === 'Maracanaú') {
        frete = 3.00;
    }
    atualizarResumoComFrete(frete);
}
function atualizarResumoComFrete(frete) {
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const orderItems = document.getElementById('order-items');
    const totalPrice = document.getElementById('total-price');
    let subtotal = 0;
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
        subtotal += item.preco;
    });
    const freteLi = document.createElement('li');
    freteLi.innerHTML = `<span>Frete</span><span>R$ ${frete.toFixed(2)}</span>`;
    orderItems.appendChild(freteLi);
    const total = subtotal + frete;
    totalPrice.textContent = `R$ ${total.toFixed(2)}`;
}
window.onload = function() {
    atualizarResumoComFrete(0);
};

