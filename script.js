/* =========================================================
   Circuito Assistência Técnica — script.js
   1. Navegação em abas
   2. Slideshow do banner inicial
   3. Catálogo de produtos + filtragem
   4. Menu mobile e formulário de contato
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. NAVEGAÇÃO EM ABAS
  --------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabLinks   = document.querySelectorAll('[data-tab-link]');
  const panels     = document.querySelectorAll('.panel');
  const tabnav     = document.getElementById('tabnav');

  const hero = document.querySelector('.hero');

  function activateTab(tabName){
    panels.forEach(p => p.classList.toggle('is-active', p.id === `panel-${tabName}`));

    document.querySelectorAll('.tabnav__btn').forEach(btn => {
      btn.setAttribute('aria-selected', btn.dataset.tab === tabName ? 'true' : 'false');
    });

    hero.style.display = tabName === 'inicio' ? '' : 'none';

    tabnav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: document.querySelector('main').offsetTop - 76, behavior: 'smooth' });
    history.replaceState(null, '', `#${tabName}`);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(link.dataset.tabLink);
    });
  });

  // abre a aba pela URL, se houver hash válido
  const initialTab = window.location.hash.replace('#', '');
  if (initialTab && document.getElementById(`panel-${initialTab}`)) {
    activateTab(initialTab);
  }

  /* ---------------------------------------------------------
     2. SLIDESHOW DO BANNER
  --------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero__slide');
  const dots   = document.querySelectorAll('#heroDots button');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(index){
    slides[currentSlide].classList.remove('is-active');
    dots[currentSlide].classList.remove('is-active');
    currentSlide = index;
    slides[currentSlide].classList.add('is-active');
    dots[currentSlide].classList.add('is-active');
  }

  function nextSlide(){
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlideshow(){
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 6000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(Number(dot.dataset.slide));
      startSlideshow();
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length > 1 && !prefersReducedMotion) startSlideshow();

  /* ---------------------------------------------------------
     3. CATÁLOGO DE PRODUTOS
  --------------------------------------------------------- */
  const products = [
    { id: 1,  name: 'SSD 480GB SATA III',            cat: 'pecas',       price: 210,  stock: true,  desc: 'Upgrade de velocidade para notebooks e desktops com HD tradicional.' },
    { id: 2,  name: 'Memória RAM 8GB DDR4',           cat: 'pecas',       price: 165,  stock: true,  desc: 'Compatível com a maioria dos notebooks e PCs de mesa a partir de 2016.' },
    { id: 3,  name: 'Fonte ATX 500W real',            cat: 'pecas',       price: 320,  stock: true,  desc: 'Fonte com selo 80 Plus, indicada para upgrades com placa de vídeo.' },
    { id: 4,  name: 'Cooler para processador AMD',    cat: 'pecas',       price: 140,  stock: false, desc: 'Dissipador com tubos de cobre, reduz temperatura em até 15°C.' },
    { id: 5,  name: 'HD 1TB recondicionado',          cat: 'pecas',       price: 195,  stock: true,  desc: 'Testado e com garantia de 90 dias — ótimo para arquivamento.' },
    { id: 6,  name: 'Placa-mãe socket AM4 usada',     cat: 'pecas',       price: 380,  stock: false, desc: 'Testada em bancada, ideal para reposição de placa danificada.' },
    { id: 7,  name: 'Teclado mecânico ABNT2',         cat: 'perifericos', price: 175,  stock: true,  desc: 'Switches azuis, indicado para digitação e uso prolongado.' },
    { id: 8,  name: 'Mouse óptico com fio',           cat: 'perifericos', price: 55,   stock: true,  desc: 'Sensor de 1200 DPI, encaixe USB padrão.' },
    { id: 9,  name: 'Monitor 21" Full HD',            cat: 'perifericos', price: 620,  stock: true,  desc: 'Painel IPS, entrada HDMI e VGA — usado em bancada de testes.' },
    { id: 10, name: 'Headset com microfone',          cat: 'perifericos', price: 90,   stock: false, desc: 'Conector P2, indicado para chamadas e uso básico em jogos.' },
    { id: 11, name: 'Reparo de placa-mãe',            cat: 'servicos',    price: 150,  stock: true,  desc: 'Diagnóstico e troca de componente danificado. Valor inicial.' },
    { id: 12, name: 'Formatação com backup',          cat: 'servicos',    price: 110,  stock: true,  desc: 'Backup de arquivos, formatação e instalação de programas essenciais.' },
    { id: 13, name: 'Limpeza e pasta térmica',        cat: 'servicos',    price: 90,   stock: true,  desc: 'Remoção de poeira interna e troca de pasta térmica do processador.' },
    { id: 14, name: 'Montagem de PC sob medida',      cat: 'servicos',    price: 150,  stock: true,  desc: 'Mão de obra de montagem — peças escolhidas junto com você.' },
  ];

  const catLabels = { pecas: 'Peças', perifericos: 'Periférico', servicos: 'Serviço' };

  const grid          = document.getElementById('productGrid');
  const searchInput    = document.getElementById('searchInput');
  const sortSelect      = document.getElementById('sortSelect');
  const priceRange       = document.getElementById('priceRange');
  const priceValue        = document.getElementById('priceValue');
  const onlyStock           = document.getElementById('onlyStock');
  const resultCount         = document.getElementById('resultCount');
  const resetFiltersBtn     = document.getElementById('resetFilters');
  const categoryCheckboxes  = Array.from(document.querySelectorAll('input[name="categoria"]'));

  function svgForCategory(cat){
    const common = 'width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"';
    if (cat === 'pecas')       return `<svg ${common}><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M9 4v16M4 9h16"/></svg>`;
    if (cat === 'perifericos') return `<svg ${common}><rect x="3" y="5" width="18" height="12" rx="1"/><path d="M8 21h8M12 17v4"/></svg>`;
    return `<svg ${common}><path d="M12 3v6m0 0l3-3m-3 3L9 6M5 12H3m18 0h-2M12 21v-6m0 0l3 3m-3-3l-3 3"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  function currentCategoryFilter(){
    const checked = categoryCheckboxes.filter(c => c.checked && c.value !== 'todas').map(c => c.value);
    return checked; // vazio = todas
  }

  function renderProducts(){
    const term      = searchInput.value.trim().toLowerCase();
    const maxPrice  = Number(priceRange.value);
    const cats      = currentCategoryFilter();
    const stockOnly = onlyStock.checked;
    const sortBy    = sortSelect.value;

    let list = products.filter(p => {
      const matchesTerm  = p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
      const matchesCat   = cats.length === 0 || cats.includes(p.cat);
      const matchesPrice = p.price <= maxPrice;
      const matchesStock = !stockOnly || p.stock;
      return matchesTerm && matchesCat && matchesPrice && matchesStock;
    });

    if (sortBy === 'menor-preco') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'maior-preco') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'nome')        list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    resultCount.textContent = `${list.length} ${list.length === 1 ? 'item encontrado' : 'itens encontrados'}`;

    if (list.length === 0){
      grid.innerHTML = `<div class="empty-state">nenhum item encontrado com esses filtros — tente ampliar a faixa de preço ou limpar a busca.</div>`;
      return;
    }

    grid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="product-card__media">
          <span class="product-card__tag">${p.stock ? 'em estoque' : 'sob encomenda'}</span>
          ${svgForCategory(p.cat)}
        </div>
        <div class="product-card__body">
          <span class="product-card__cat">${catLabels[p.cat]}</span>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="product-card__foot">
            <span class="product-card__price">R$ ${p.price.toLocaleString('pt-BR')}</span>
            <button class="product-card__buy" data-name="${p.name}">consultar</button>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.product-card__buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = encodeURIComponent(`Olá! Tenho interesse em: ${btn.dataset.name}`);
        window.open(`https://wa.me/5585999999999?text=${msg}`, '_blank');
      });
    });
  }

  // categoria: "todas" desmarca as outras e vice-versa
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.value === 'todas' && cb.checked){
        categoryCheckboxes.forEach(other => { if (other.value !== 'todas') other.checked = false; });
      } else if (cb.value !== 'todas' && cb.checked){
        categoryCheckboxes.find(c => c.value === 'todas').checked = false;
      } else if (categoryCheckboxes.every(c => !c.checked)){
        categoryCheckboxes.find(c => c.value === 'todas').checked = true;
      }
      renderProducts();
    });
  });

  priceRange.addEventListener('input', () => {
    priceValue.textContent = `até R$ ${Number(priceRange.value).toLocaleString('pt-BR')}`;
    renderProducts();
  });

  searchInput.addEventListener('input', renderProducts);
  sortSelect.addEventListener('change', renderProducts);
  onlyStock.addEventListener('change', renderProducts);

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    sortSelect.value = 'relevancia';
    priceRange.value = 1200;
    priceValue.textContent = 'até R$ 1200';
    onlyStock.checked = false;
    categoryCheckboxes.forEach(c => c.checked = c.value === 'todas');
    renderProducts();
  });

  renderProducts();

  /* ---------------------------------------------------------
     4. MENU MOBILE
  --------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    const isOpen = tabnav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------------------------------------------------------
     5. FORMULÁRIO DE CONTATO (envio simulado — site estático)
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote     = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome     = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const msg = encodeURIComponent(`Olá, meu nome é ${nome}. ${mensagem}`);
    formNote.textContent = 'Abrindo o WhatsApp com sua mensagem...';
    window.open(`https://wa.me/5585999999999?text=${msg}`, '_blank');
    contactForm.reset();
  });

});
