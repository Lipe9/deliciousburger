// Funções para o modal do produto
const modalProduto = document.getElementById('modalProduto');
const fecharModalProduto = document.getElementById('fecharModalProduto');
const modalImagem = document.getElementById('modalImagem');
const modalNome = document.getElementById('modalNome');
const modalPreco = document.getElementById('modalPreco');
const modalDetails = document.getElementById('modalDetails');
const btnAdicionarCarrinho = document.getElementById('btnAdicionarCarrinho');
const btnComprarAgora = document.getElementById('btnComprarAgora');

// Função para abrir o modal do produto
function abrirModalProduto(produto) {
  modalImagem.src = produto.imagem;
  modalNome.textContent = produto.nome;
  modalPreco.textContent = `R$ ${produto.preco}`;
  modalPreco.dataset.basePrice = produto.preco; // Store base price
  modalDetails.textContent = produto.details;

  // Limpar opções anteriores
  const existingOptions = document.getElementById('modalOptions');
  if (existingOptions) {
    existingOptions.remove();
  }

  // Criar container para opções
  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'modalOptions';

  // Adicionar opções se existirem
  if (produto.variations && Array.isArray(produto.variations)) {
    produto.variations.forEach(variation => {
      const variationDiv = document.createElement('div');
      variationDiv.className = 'variation';

      const label = document.createElement('label');
      label.textContent = variation.name + ': ';
      variationDiv.appendChild(label);

      if (variation.type === 'select') {
        const select = document.createElement('select');
        select.name = variation.name;
        variation.options.forEach(option => {
          const opt = document.createElement('option');
          opt.value = option;
          opt.textContent = option;
          select.appendChild(opt);
        });
        variationDiv.appendChild(select);
      } else if (variation.type === 'checkbox') {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'options-buttons';
        variation.options.forEach(option => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'option-btn';
          button.textContent = option;
          button.dataset.name = variation.name;
          button.dataset.value = option;
          // Parse price from option text
          const priceMatch = option.match(/\(\+R\$\s*(\d+(?:,\d{2})?)\)/);
          if (priceMatch) {
            button.dataset.price = parseFloat(priceMatch[1].replace(',', '.'));
          } else {
            button.dataset.price = 0;
          }
          button.addEventListener('click', () => {
            button.classList.toggle('selected');
            updateModalPrice();
          });
          optionsContainer.appendChild(button);
        });
        variationDiv.appendChild(optionsContainer);
      } else if (variation.type === 'textarea') {
        // Adicionar campo de texto para personalização
        const textarea = document.createElement('textarea');
        textarea.name = variation.name;
        textarea.placeholder = variation.placeholder || 'Digite sua personalização aqui...';
        textarea.rows = variation.rows || 3;
        textarea.style.width = '100%';
        variationDiv.appendChild(textarea);
      }

      optionsContainer.appendChild(variationDiv);
    });
  }

  // Inserir opções antes dos botões
  const modalContent = modalProduto.querySelector('.modal-content');
  modalContent.insertBefore(optionsContainer, modalContent.querySelector('.modal-buttons'));

  modalProduto.style.display = 'flex';
}

// Function to update modal price based on selected extras and quantity
function updateModalPrice() {
  const basePrice = parseFloat(modalPreco.dataset.basePrice.replace(',', '.'));
  let extraPrice = 0;
  const selectedButtons = document.querySelectorAll('#modalOptions .option-btn.selected');
  selectedButtons.forEach(button => {
    extraPrice += parseFloat(button.dataset.price || 0);
  });
  const quantitySelect = document.querySelector('#modalOptions select[name="Quantidade"]');
  const quantity = quantitySelect ? parseInt(quantitySelect.value) || 1 : 1;
  const totalPrice = (basePrice + extraPrice) * quantity;
  modalPreco.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// Função para fechar o modal do produto
function fecharModalProdutoFunc() {
  modalProduto.style.display = 'none';
}

// Event listeners para abrir modal ao clicar no card do produto
document.querySelectorAll('.card-produto').forEach(card => {
  card.addEventListener('click', () => {
    const nome = card.querySelector('h3').textContent;
    const preco = parseFloat(card.querySelector('.preco').textContent.replace('R$', '').trim());
    const imagem = card.querySelector('img').getAttribute('data-imagem') || card.querySelector('img').src;
    const details = card.getAttribute('data-details');
    let variations = [];
    const variationsData = card.getAttribute('data-variations');
    if (variationsData) {
      try {
        variations = JSON.parse(variationsData);
      } catch (e) {
        console.error('Erro ao parsear variações:', e);
      }
    }
    abrirModalProduto({ nome, preco, imagem, details, variations });
  });
});

// Event listener para fechar modal
fecharModalProduto.addEventListener('click', fecharModalProdutoFunc);

// Fechar modal ao clicar fora
modalProduto.addEventListener('click', (e) => {
  if (e.target === modalProduto) {
    fecharModalProdutoFunc();
  }
});

// Event listener para botão "Adicionar ao Carrinho"
btnAdicionarCarrinho.addEventListener('click', () => {
  const nome = modalNome.textContent;
  const preco = parseFloat(modalPreco.textContent.replace('R$', '').trim());
  const imagem = modalImagem.src;

  // Capturar opções selecionadas
  const optionsContainer = document.getElementById('modalOptions');
  let selectedOptions = {};
  if (optionsContainer) {
    const selects = optionsContainer.querySelectorAll('select');
    selects.forEach(select => {
      selectedOptions[select.name] = select.value;
    });
    const selectedButtons = optionsContainer.querySelectorAll('.option-btn.selected');
    selectedButtons.forEach(button => {
      const name = button.dataset.name;
      const value = button.dataset.value;
      if (!selectedOptions[name]) {
        selectedOptions[name] = [];
      }
      selectedOptions[name].push(value);
    });
    const textareas = optionsContainer.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      selectedOptions[textarea.name] = textarea.value;
    });
  }

  adicionarAoCarrinho(nome, preco, imagem, selectedOptions);
  fecharModalProdutoFunc();
});

 // Event listener para botão "Comprar Agora"
btnComprarAgora.addEventListener('click', () => {
  const nome = modalNome.textContent;
  const preco = parseFloat(modalPreco.textContent.replace('R$', '').trim());
  const imagem = modalImagem.src;

  // Capturar opções selecionadas
  const optionsContainer = document.getElementById('modalOptions');
  let selectedOptions = {};
  if (optionsContainer) {
    const selects = optionsContainer.querySelectorAll('select');
    selects.forEach(select => {
      selectedOptions[select.name] = select.value;
    });
    const selectedButtons = optionsContainer.querySelectorAll('.option-btn.selected');
    selectedButtons.forEach(button => {
      const name = button.dataset.name;
      const value = button.dataset.value;
      if (!selectedOptions[name]) {
        selectedOptions[name] = [];
      }
      selectedOptions[name].push(value);
    });
    const textareas = optionsContainer.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      selectedOptions[textarea.name] = textarea.value;
    });
  }

  adicionarAoCarrinho(nome, preco, imagem, selectedOptions);
  fecharModalProdutoFunc();
  window.location.href = 'comprar.html';
});
