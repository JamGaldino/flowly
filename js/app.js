/* ===== APP — Router + Inicialização ===== */
const App = {
  init() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => this.route());

    // Initial route
    if (!Store.isOnboardingDone()) {
      this.navigate('#/onboarding');
    } else if (!location.hash || location.hash === '#/') {
      this.navigate('#/agenda');
    } else {
      this.route();
    }
  },

  navigate(hash) {
    location.hash = hash;
  },

  route() {
    const hash = location.hash || '#/';
    const app = document.getElementById('app');
    let html = '';
    let activeTab = '';

    // Onboarding
    if (hash === '#/onboarding') {
      Screens.onboarding();
      return; // onboarding manages its own rendering
    }

    // Check if onboarding is complete
    if (!Store.isOnboardingDone()) {
      this.navigate('#/onboarding');
      return;
    }

    // Route matching
    if (hash === '#/' || hash === '#/agenda' || hash === '#/week') {
      if (hash === '#/week') Screens._agendaViewMode = 'week';
      html = Screens.agenda();
      activeTab = 'agenda';
    } else if (hash === '#/appointment/new') {
      html = Screens.appointmentForm(null);
      activeTab = 'new';
    } else if (hash.match(/^#\/appointment\/(.+)\/edit$/)) {
      const id = hash.match(/^#\/appointment\/(.+)\/edit$/)[1];
      html = Screens.appointmentForm(id);
      activeTab = '';
    } else if (hash.match(/^#\/appointment\/(.+)$/)) {
      const id = hash.match(/^#\/appointment\/(.+)$/)[1];
      html = Screens.appointmentDetail(id);
      activeTab = '';
    } else if (hash === '#/settings') {
      html = Screens.settings();
      activeTab = 'settings';
    } else if (hash === '#/upgrade') {
      html = Screens.upgrade();
      activeTab = 'upgrade';
    } else {
      html = Screens.agendaDay();
      activeTab = 'agenda';
    }

    app.innerHTML = html;
    this._renderNavbar(activeTab);

    // Scroll to top on navigation
    window.scrollTo(0, 0);
  },

  _renderNavbar(activeTab) {
    let nav = document.getElementById('bottom-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'bottom-nav';
      document.body.appendChild(nav);
    }
    nav.className = 'bottom-nav';
    nav.style.display = 'flex';
    nav.innerHTML = `
      <button class="nav-item ${activeTab==='agenda'?'active':''}" onclick="App.navigate('#/agenda')">
        ${Icons.calendar}<span>Agenda</span>
      </button>
      <button class="nav-item ${activeTab==='new'?'active':''}" onclick="App.navigate('#/appointment/new')">
        ${Icons.plus}<span>Novo</span>
      </button>
      <button class="nav-item ${activeTab==='settings'?'active':''}" onclick="App.navigate('#/settings')">
        ${Icons.settings}<span>Config</span>
      </button>
      <button class="nav-item ${activeTab==='upgrade'?'active':''}" onclick="App.navigate('#/upgrade')">
        ${Icons.star}<span>Pro</span>
      </button>`;
  },

  _updateApp() {
    this.route();
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
