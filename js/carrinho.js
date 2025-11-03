/**
 * Inicializa o carrinho de compras a partir do localStorage ou cria um array vazio.
 * O carrinho armazena os itens selecionados pelo usuário.
 */
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para salvar o estado atual do carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(produto, preco, imagem, opcoes = {}) {
  carrinho.push({ produto, preco, imagem, opcoes });
  salvarCarrinho();
  atualizarContadorCarrinho();
  atualizarMiniCarrinho();
  exibirNotificacao(`${produto} foi adicionado ao carrinho!`);
}

// Função para atualizar os contadores de itens no ícone do carrinho (desktop e mobile)
function atualizarContadorCarrinho() {
  document.getElementById('cart-count').textContent = carrinho.length;
  document.getElementById('cart-count-mobile').textContent = carrinho.length;
}

// Seletores para elementos do carrinho
const miniCarrinho = document.getElementById('miniCarrinho');
const fecharCarrinho = document.getElementById('fecharCarrinho');
const carrinhoLinkDesktop = document.querySelector('.carrinho-link');
const carrinhoLinkMobile = document.querySelector('.mobile-menu .carrinho-link');

// Função para abrir o modal do mini carrinho
function abrirCarrinho() {
  miniCarrinho.style.display = 'block';
}
// Função para fechar o modal do mini carrinho
function fecharMiniCarrinho() {
  miniCarrinho.style.display = 'none';
}

// Função para atualizar a lista de itens no mini carrinho e calcular o total
function atualizarMiniCarrinho() {
  const itensCarrinho = document.getElementById('itensCarrinho');
  const totalCarrinho = document.getElementById('totalCarrinho');

  itensCarrinho.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    let opcoesTexto = '';
    if (item.opcoes && Object.keys(item.opcoes).length > 0) {
      opcoesTexto = '<br><small>';
      for (const [key, value] of Object.entries(item.opcoes)) {
        if (Array.isArray(value)) {
          opcoesTexto += `${key}: ${value.join(', ')}; `;
        } else {
          opcoesTexto += `${key}: ${value}; `;
        }
      }
      opcoesTexto += '</small>';
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.imagem}" alt="${item.produto}" width="50" height="50" style="border-radius: 5px; margin-right: 10px;">
      <span>${item.produto}${opcoesTexto}</span>
      <span>R$ ${item.preco.toFixed(2)}</span>
      <button onclick="removerItemDoCarrinho(${index})" style="margin-left: 10px; color: red; background: none; border: none; font-size: 16px;">X</button>
    `;
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.style.marginBottom = '10px';
    itensCarrinho.appendChild(li);

    total += item.preco;
  });

  totalCarrinho.textContent = `R$ ${total.toFixed(2)}`;
}

// Função para remover um item específico do carrinho pelo índice
function removerItemDoCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarContadorCarrinho();
  atualizarMiniCarrinho();
}

// Função para limpar todos os itens do carrinho
function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarContadorCarrinho();
  atualizarMiniCarrinho();
}

// Event listener para o botão de limpar carrinho
document.getElementById('limparCarrinho').addEventListener('click', () => {
  limparCarrinho();
  exibirNotificacao('Carrinho limpo com sucesso!');
});

// Event listeners para abrir o carrinho ao clicar nos links (desktop e mobile)
carrinhoLinkDesktop.addEventListener('click', (e) => {
  e.preventDefault();
  abrirCarrinho();
});
carrinhoLinkMobile.addEventListener('click', (e) => {
  e.preventDefault();
  abrirCarrinho();
});
fecharCarrinho.addEventListener('click', fecharMiniCarrinho);

// Função para exibir notificações temporárias (usada para feedback ao usuário)
function exibirNotificacao(mensagem) {
  const container = document.getElementById('notificacao-container');
  const notificacao = document.createElement('div');
  notificacao.classList.add('notificacao');
  notificacao.textContent = mensagem;
  container.appendChild(notificacao);
  setTimeout(() => {
    notificacao.remove();
  }, 4000);
}

// Inicialização do carrinho quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  atualizarMiniCarrinho();
});

// Event listeners para os botões "Comprar" em cada produto
document.querySelectorAll('.btn-comprar').forEach((botao) => {
  botao.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent card click
    const nome = botao.getAttribute('data-nome');
    const preco = parseFloat(botao.getAttribute('data-preco'));
    const imagem = botao.getAttribute('data-imagem');

    adicionarAoCarrinho(nome, preco, imagem);
  });
});

// Função para adicionar promoção ao carrinho (compatível com carrinho.js)
function adicionarPromocaoAoCarrinho(nome, preco, details) {
  const item = {
    produto: nome,
    preco: parseFloat(preco),
    imagem: 'img/logo.jpg', // imagem padrão para promoções
    opcoes: { details: details }
  };
  carrinho.push(item);
  salvarCarrinho();
  atualizarContadorCarrinho();
  atualizarMiniCarrinho();
  exibirNotificacao(`${nome} adicionado ao carrinho!`);
}
