/* Progressive enhancement only. All pages and stories work without JavaScript. */
(() => {
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.getElementById('primary-navigation');
  if (toggle && navigation) {
    toggle.hidden = false;
    const closeMenu = (restoreFocus = false) => {
      navigation.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      if (restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = navigation.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  }

  const journal = document.querySelector('[data-journal]');
  if (!journal) return;
  const controls = journal.querySelector('[data-journal-tools]');
  const search = journal.querySelector('#journal-search');
  const buttons = [...journal.querySelectorAll('[data-filter]')];
  const cards = [...journal.querySelectorAll('[data-post-card]')];
  const status = journal.querySelector('[data-result-count]');
  const empty = journal.querySelector('[data-no-results]');
  let category = 'all';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function update() {
    const query = normalize(search.value);
    let count = 0;
    cards.forEach(card => {
      const visible = (category === 'all' || card.dataset.category === category) && normalize(card.dataset.search).includes(query);
      card.hidden = !visible;
      if (visible) count++;
    });
    buttons.forEach(button => {
      const selected = button.dataset.filter === category;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    status.textContent = `${count} ${count === 1 ? 'story' : 'stories'}${category === 'all' ? '' : ` in ${category}`}${query ? ' matching your search' : ''}`;
    empty.hidden = count > 0 || cards.length === 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; update(); }));
  search.addEventListener('input', update);
  controls.hidden = false;
  status.hidden = false;
  update();
})();
