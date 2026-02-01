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
    document.getElementById('dinheiro-fields').classList.add('hidden');

    if (method === 'cartao') {
        document.getElementById('cartao-fields').classList.remove('hidden');
    } else if (method === 'pix') {
        document.getElementById('pix-fields').classList.remove('hidden');
    } else if (method === 'dinheiro') {
        document.getElementById('dinheiro-fields').classList.remove('hidden');
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

// Função para finalizar pedido e enviar via WhatsApp
function finalizarPedido(event) {
    event.preventDefault();

    // Coletar dados do endereço
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cep = document.getElementById('cep').value;
    const bairro = document.getElementById('bairro').value;
    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    // Coletar dados do pagamento
    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    let pagamentoDetalhes = '';
    if (pagamento === 'cartao') {
        const tipoCartao = document.querySelector('input[name="tipo-cartao"]:checked').value;
        pagamentoDetalhes = `Cartão ${tipoCartao}`;
    } else if (pagamento === 'pix') {
        pagamentoDetalhes = 'PIX';
    } else if (pagamento === 'dinheiro') {
        pagamentoDetalhes = 'Dinheiro';
    }

    // Coletar itens do carrinho
    const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    let itensTexto = '';
    let total = 0;
    cart.forEach(item => {
        itensTexto += `- ${item.produto}`;
        if (item.opcoes && Object.keys(item.opcoes).length > 0) {
            const options = [];
            for (const [key, value] of Object.entries(item.opcoes)) {
                if (Array.isArray(value)) {
                    options.push(`${key}: ${value.join(', ')}`);
                } else {
                    options.push(`${key}: ${value}`);
                }
            }
            itensTexto += ` (${options.join('; ')})`;
        }
        itensTexto += ` - R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    // Montar mensagem do WhatsApp
    const mensagem = `*Novo Pedido - Delicious Burger*\n\n` +
        `*Cliente:* ${nome}\n` +
        `*Email:* ${email}\n` +
        `*Telefone:* ${telefone}\n\n` +
        `*Endereço de Entrega:*\n` +
        `${endereco}, ${numero}${complemento ? ', ' + complemento : ''}\n` +
        `${bairro}, ${cidade} - ${estado}\n` +
        `CEP: ${cep}\n\n` +
        `*Itens do Pedido:*\n${itensTexto}\n` +
        `*Total:* R$ ${total.toFixed(2)}\n\n` +
        `*Forma de Pagamento:* ${pagamentoDetalhes}\n\n` +
        `Por favor, confirme o pedido.`;

    const numeroWhatsApp = '558592757765'; 

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');

    // Limpar carrinho após envio
    localStorage.removeItem('carrinho');

    // Redirecionar ou mostrar confirmação
    alert('Pedido enviado via WhatsApp! Você será redirecionado para a página inicial.');
    window.location.href = 'index.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    populateOrderSummary();
    // Set initial selected payment
    selectPayment('cartao');

    // Adicionar event listener para o formulário de pagamento
    document.getElementById('payment-form').addEventListener('submit', finalizarPedido);
});
