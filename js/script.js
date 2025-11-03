// Função para alternar o menu hambúrguer (abrir/fechar)
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
  }

  // Fecha o menu ao clicar em um link mobile
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileMenu').classList.remove('active');
      document.getElementById('hamburger').classList.remove('active');
    });
  });

  // Ativa o link do menu baseado na rolagem da página
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a, .mobile-menu a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

// Função para filtrar produtos por categoria
function filterProducts(category) {
  const products = document.querySelectorAll('.card-produto');
  products.forEach(product => {
    if (category === 'todos' || product.getAttribute('data-category') === category) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });
}

// Função para buscar produtos por nome
function searchProducts(query) {
  const products = document.querySelectorAll('.card-produto');
  products.forEach(product => {
    const name = product.querySelector('h3').textContent.toLowerCase();
    if (name.includes(query.toLowerCase())) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });
}

// Event listeners para botões de filtro
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    filterProducts(filter);
  });
});

// Event listener para barra de busca
document.getElementById('search-bar').addEventListener('input', (e) => {
  const query = e.target.value;
  searchProducts(query);
});

// Event listeners para cards de ícones (filtrar por categoria)
document.querySelectorAll('.icon-card').forEach(card => {
  card.addEventListener('click', () => {
    const category = card.getAttribute('data-category');
    filterProducts(category);
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.filter-btn[data-filter="${category}"]`).classList.add('active');
  });
});

// Elementos do Mini Delivery
const miniDelivery = document.getElementById('miniDelivery');
const fecharDelivery = document.getElementById('fecharDelivery');
const deliveryForm = document.getElementById('deliveryForm');

// Função para abrir o modal de delivery
function abrirDelivery() {
  miniDelivery.style.display = 'block';
}
// Função para fechar o modal de delivery
function fecharMiniDelivery() {
  miniDelivery.style.display = 'none';
}

// Event listeners para links de delivery
document.querySelectorAll('a[href="#delivery"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    abrirDelivery();
  });
});

// Event listener para fechar delivery
fecharDelivery.addEventListener('click', fecharMiniDelivery);

// Event listener para submissão do formulário de delivery
deliveryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cep = document.getElementById('cep').value;
  const endereco = document.getElementById('endereco').value;
  if (cep && endereco) {
    localStorage.setItem('delivery', JSON.stringify({cep, endereco}));
    exibirNotificacao('Informações de entrega salvas!');
    fecharMiniDelivery();
    deliveryForm.reset();
  }
});

// Função para adicionar promoção ao carrinho
function adicionarPromocaoAoCarrinho(nome, preco, details) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const item = {
    nome: nome,
    preco: parseFloat(preco),
    quantidade: 1,
    details: details
  };
  carrinho.push(item);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
  exibirNotificacao(`${nome} adicionado ao carrinho!`);
}

// Event listeners para botões de comprar promoção
document.querySelectorAll('.btn-comprar-promocao').forEach(btn => {
  btn.addEventListener('click', () => {
    const nome = btn.getAttribute('data-nome');
    const preco = btn.getAttribute('data-preco');
    const details = btn.getAttribute('data-details');
    adicionarPromocaoAoCarrinho(nome, preco, details);
  });
});


