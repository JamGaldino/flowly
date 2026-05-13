/* ===== SCREENS — Todas as 7 telas do MVP ===== */
const Screens = {

  /* ========================================
     TELA 1 — ONBOARDING (3 steps)
     ======================================== */
  _onboardingStep: 1,
  _tempServices: [],
  _obNotifProf: [],
  _obNotifCli: [],
  _transitionDirection: 'right', // 'right' for forward, 'left' for back
  _suggestions: {
    'Manicure': ['Manicure', 'Pedicure', 'Gel', 'Fibra de vidro', 'Blindagem'],
    'Lash Designer': ['Lash Classic', 'Lash Volume', 'Lash Híbrido', 'Lifting de Cílios'],
    'Confeiteira': ['Bolo de Festa', 'Docinhos', 'Cupcake', 'Bento Cake'],
    'Cabeleireira': ['Corte', 'Escova', 'Coloração', 'Hidratação', 'Luzes'],
    'Esteticista': ['Limpeza de Pele', 'Drenagem', 'Massagem Modeladora'],
    'Designer de Sobrancelhas': ['Design Simples', 'Design com Henna', 'Micropigmentação']
  },

  onboarding() {
    this._onboardingStep = Store.getOnboardingStep();
    const profile = Store.getProfile();
    this._tempServices = (profile.services || []).map(s => ({
      ...s,
      priceFormatted: 'R$ ' + s.price.toFixed(2).replace('.', ',')
    }));
    this._obNotifProf = profile.notificacoes_profissional || ['1 dia antes'];
    this._obNotifCli = profile.notificacoes_clientes || ['1 dia antes'];
    this._transitionDirection = 'right';
    return this._renderOnboardingStep();
  },

  _renderOnboardingStep() {
    const step = this._onboardingStep;
    const progressWidth = step === 1 ? 33 : (step === 2 ? 66 : 100);
    const animClass = this._transitionDirection === 'right' ? 'slide-in-right' : 'slide-in-left';

    let content = '';
    if (step === 1) {
      const profile = Store.getProfile();
      content = `
        <div class="onboarding-header">
          <span class="onboarding-emoji-inline">👋</span>
          <h1>Bem-vinda!</h1>
        </div>
        <p class="onboarding-desc">Vamos configurar seu perfil em menos de 5 minutos.</p>
        <div class="onboarding-form">
          <div class="input-group">
            <label>Seu nome</label>
            <input type="text" id="ob-name" placeholder="Ex: Ana Silva" value="${profile.name || ''}" oninput="Screens._clearError(this)">
            <span class="error-msg" id="err-ob-name">Digite seu nome para continuar</span>
          </div>
          <div class="input-group">
            <label>Tipo de serviço</label>
            <select id="ob-type" onchange="Screens._handleTypeChange(this)">
              <option value="">Selecione...</option>
              <option value="Manicure" ${profile.serviceType === 'Manicure' ? 'selected' : ''}>Manicure / Nail Designer</option>
              <option value="Lash Designer" ${profile.serviceType === 'Lash Designer' ? 'selected' : ''}>Lash Designer</option>
              <option value="Confeiteira" ${profile.serviceType === 'Confeiteira' ? 'selected' : ''}>Confeiteira / Boleira</option>
              <option value="Cabeleireira" ${profile.serviceType === 'Cabeleireira' ? 'selected' : ''}>Cabeleireira</option>
              <option value="Esteticista" ${profile.serviceType === 'Esteticista' ? 'selected' : ''}>Esteticista</option>
              <option value="Massagista" ${profile.serviceType === 'Massagista' ? 'selected' : ''}>Massagista</option>
              <option value="Designer de Sobrancelhas" ${profile.serviceType === 'Designer de Sobrancelhas' ? 'selected' : ''}>Designer de Sobrancelhas</option>
              <option value="Outro" ${!this._suggestions[profile.serviceType] && profile.serviceType ? 'selected' : ''}>Outro</option>
            </select>
            <span class="error-msg" id="err-ob-type">Selecione uma opção</span>
          </div>
          <div class="input-group">
            <label>Onde você atende? (Endereço)</label>
            <input type="text" id="ob-address" placeholder="Ex: Rua das Flores, 123" value="${profile.address || ''}" oninput="Screens._clearError(this)">
            <span class="error-msg" id="err-ob-address">Digite seu endereço</span>
          </div>
          <span class="info-text-small">Você pode alterar isso depois nas configurações.</span>
          <div class="input-group" id="ob-type-custom" style="display:${!this._suggestions[profile.serviceType] && profile.serviceType ? 'block' : 'none'}">
            <label>Qual sua profissão?</label>
            <input type="text" id="ob-type-custom-input" placeholder="Ex: Personal Trainer, Fotógrafa..." value="${!this._suggestions[profile.serviceType] && profile.serviceType ? profile.serviceType : ''}" oninput="Screens._clearError(this)">
            <span class="error-msg" id="err-ob-type-custom">Digite sua profissão</span>
          </div>
        </div>`;
    } else if (step === 2) {
      const profile = Store.getProfile();
      const suggestions = this._suggestions[profile.serviceType] || [];
      const chipsHtml = suggestions.map(s => `<div class="chip" onclick="Screens._fillServiceName('${s}')">${s}</div>`).join('');

      let servicesList = this._tempServices.map((s, i) => `
        <div class="card" id="svc-card-${i}" style="padding:12px 16px; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between">
          <div>
            <div style="font-weight:700; font-size:0.9rem">${s.name}</div>
            <div style="color:var(--success); font-size:0.8rem; font-weight:600">${s.priceFormatted}</div>
          </div>
          <button class="service-remove" onclick="Screens._removeOnboardingService(${i})">✕</button>
        </div>`).join('');

      if (this._tempServices.length === 0) {
        servicesList = `<div class="empty-text-sutil">Nenhum serviço adicionado ainda.</div>`;
      }

      content = `
        <div class="onboarding-header">
          <span class="onboarding-emoji-inline">💅</span>
          <h1>Seus serviços</h1>
        </div>
        <p class="onboarding-desc">Adicione os serviços que você oferece e seus preços.</p>
        <div class="onboarding-form">
          <div id="ob-services-list" style="margin-bottom:20px">${servicesList}</div>
          
          <div class="chips-container">${chipsHtml}</div>

          <div style="display:flex;gap:8px;margin-bottom:12px">
            <div class="input-group" style="flex:1;margin:0">
              <label>Nome do serviço</label>
              <input type="text" id="ob-svc-name" placeholder="Ex: Manicure Simples" oninput="Screens._clearError(this)">
            </div>
            <div class="input-group" style="width:130px;margin:0">
              <label>Preço</label>
              <input type="text" id="ob-svc-price" placeholder="R$ 0,00" inputmode="numeric" oninput="Screens._applyPriceMask(this); Screens._clearError(this)">
            </div>
          </div>
          <span class="error-msg" id="err-ob-services" style="margin-top:-8px; margin-bottom:12px">Adicione pelo menos 1 serviço para continuar</span>
          <button class="btn btn-secondary btn-block btn-sm" onclick="Screens._addOnboardingService()">+ Adicionar serviço</button>
        </div>`;
    } else {
      const optionsProf = [
        '15 minutos antes', '30 minutos antes', '1 hora antes',
        '2 horas antes', '3 horas antes', '1 dia antes', '2 dias antes'
      ];
      const optionsCli = [
        '1 hora antes', '2 horas antes', '3 horas antes',
        '1 dia antes', '2 dias antes'
      ];

      const renderChips = (list, type) => {
        if (list.length === 0) return `<div class="empty-text-sutil" style="padding:10px 0">Nenhum lembrete configurado.</div>`;
        return `<div class="chips-container" style="margin-bottom:12px">
          ${list.map((val, idx) => `
            <div class="chip" onclick="Screens._removeObNotif('${type}', ${idx})">
              ${val} <span class="chip-remove">✕</span>
            </div>
          `).join('')}
        </div>`;
      };

      content = `
        <div class="onboarding-header">
          <span class="onboarding-emoji-inline">🔔</span>
          <h1>Notificações</h1>
        </div>
        <p class="onboarding-desc">Configure quando você e suas clientes serão lembradas dos atendimentos.</p>
        
        <div class="onboarding-form">
          <!-- Seção 1: Meus Lembretes -->
          <div class="notif-section">
            <div class="section-subtitle">👩 Meus lembretes</div>
            <span class="section-desc">Quando você quer ser avisada antes de cada atendimento.</span>
            
            ${renderChips(this._obNotifProf, 'prof')}

            ${this._obNotifProf.length < 3 ? `
              <select class="inline-dropdown" onchange="Screens._addObNotif('prof', this.value); this.value=''">
                <option value="">+ Adicionar lembrete</option>
                ${optionsProf.map(opt => `
                  <option value="${opt}" ${this._obNotifProf.includes(opt) ? 'disabled' : ''}>${opt}</option>
                `).join('')}
              </select>
            ` : ''}
          </div>

          <div class="section-sep"></div>

          <!-- Seção 2: Lembretes Clientes -->
          <div class="notif-section">
            <div class="section-subtitle">💬 Lembretes para minhas clientes <span class="tag-whatsapp">via WhatsApp</span></div>
            <span class="section-desc">Suas clientes recebem pelo WhatsApp.</span>
            
            ${renderChips(this._obNotifCli, 'cli')}

            ${this._obNotifCli.length < 2 ? `
              <select class="inline-dropdown" onchange="Screens._addObNotif('cli', this.value); this.value=''">
                <option value="">+ Adicionar lembrete</option>
                ${optionsCli.map(opt => `
                  <option value="${opt}" ${this._obNotifCli.includes(opt) ? 'disabled' : ''}>${opt}</option>
                `).join('')}
              </select>
            ` : ''}
          </div>
        </div>`;
    }

    const btnLabel = step === 3 ? 'Começar a usar! 🚀' : 'Próximo';

    const html = `
      <div class="onboarding-container">
        <div class="onboarding-progress-container">
          <div class="onboarding-progress-text">Passo ${step} de 3</div>
          <div class="onboarding-progress-bar">
            <div class="onboarding-progress-fill" style="width: ${progressWidth}%"></div>
          </div>
        </div>
        <div class="onboarding-step-content ${animClass}">${content}</div>
        <div class="onboarding-footer">
          ${step > 1 ? `<button class="btn btn-ghost btn-block" style="margin-bottom:10px" onclick="Screens._onboardingBack()">Voltar</button>` : ''}
          <button class="btn btn-primary btn-block" id="btn-onboarding-next" onclick="Screens._onboardingNext()">${btnLabel}</button>
        </div>
      </div>`;

    const app = document.getElementById('app');
    app.innerHTML = html;

    // Auto-focus no campo nome se estiver no Passo 1
    if (step === 1) {
      setTimeout(() => {
        const input = document.getElementById('ob-name');
        if (input) input.focus();
      }, 100);
    }

    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'none';
    return html;
  },

  _addObNotif(type, value) {
    if (!value) return;
    if (type === 'prof') {
      if (this._obNotifProf.length >= 3) return;
      this._obNotifProf.push(value);
    } else {
      if (this._obNotifCli.length >= 2) return;
      this._obNotifCli.push(value);
    }
    this._renderOnboardingStep();
  },

  _removeObNotif(type, idx) {
    if (type === 'prof') {
      this._obNotifProf.splice(idx, 1);
    } else {
      this._obNotifCli.splice(idx, 1);
    }
    this._renderOnboardingStep();
  },

  _handleTypeChange(el) {
    const custom = document.getElementById('ob-type-custom');
    if (el.value === 'Outro') {
      custom.style.display = 'block';
    } else {
      custom.style.display = 'none';
    }
    this._clearError(el);
  },

  _applyPriceMask(el) {
    let value = el.value.replace(/\D/g, '');
    if (!value) { el.value = ''; return; }
    value = (parseInt(value) / 100).toFixed(2);
    el.value = 'R$ ' + value.replace('.', ',');
  },

  _fillServiceName(name) {
    const el = document.getElementById('ob-svc-name');
    el.value = name;
    this._clearError(el);
  },

  _showError(id, show = true) {
    const err = document.getElementById('err-' + id);
    const input = document.getElementById(id);
    if (err) err.classList.toggle('show', show);
    if (input) input.classList.toggle('error-input', show);
  },

  _clearError(el) {
    this._showError(el.id, false);
    const errSvc = document.getElementById('err-ob-services');
    if (errSvc) errSvc.classList.remove('show');
  },

  _addOnboardingService() {
    const nameEl = document.getElementById('ob-svc-name');
    const priceEl = document.getElementById('ob-svc-price');
    const name = nameEl.value.trim();
    const priceStr = priceEl.value.replace('R$ ', '').replace(',', '.');
    const price = parseFloat(priceStr);

    if (!name) { this._showError('ob-svc-name'); return; }
    if (isNaN(price) || price <= 0) { this._showError('ob-svc-price'); return; }

    // Duplicado?
    const exists = this._tempServices.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      Toast.error('Você já adicionou um serviço com esse nome.');
      return;
    }

    this._tempServices.push({ name, price, priceFormatted: priceEl.value });

    // Salvar serviços progressivamente no profile
    const profile = Store.getProfile();
    profile.services = this._tempServices.map((s, i) => ({
      name: s.name,
      price: s.price,
      id: 's_' + Date.now() + '_' + i
    }));
    Store.saveProfile(profile);

    nameEl.value = ''; priceEl.value = '';
    this._renderOnboardingStep();
  },

  _removeOnboardingService(i) {
    const card = document.getElementById(`svc-card-${i}`);
    if (card) {
      card.classList.add('fade-out');
      setTimeout(() => {
        this._tempServices.splice(i, 1);

        // Atualizar store
        const profile = Store.getProfile();
        profile.services = this._tempServices.map((s, idx) => ({
          name: s.name,
          price: s.price,
          id: s.id || ('s_' + Date.now() + '_' + idx)
        }));
        Store.saveProfile(profile);

        this._renderOnboardingStep();
      }, 200);
    } else {
      this._tempServices.splice(i, 1);
      this._renderOnboardingStep();
    }
  },

  _onboardingBack() {
    this._transitionDirection = 'left';
    this._onboardingStep--;
    Store.saveOnboardingStep(this._onboardingStep);
    this._renderOnboardingStep();
  },

  _onboardingNext() {
    if (this._onboardingStep === 1) {
      const nameEl = document.getElementById('ob-name');
      const typeEl = document.getElementById('ob-type');
      const name = nameEl.value.trim();
      let type = typeEl.value;

      const address = document.getElementById('ob-address').value.trim();
      let valid = true;
      if (!name) { this._showError('ob-name'); valid = false; }
      if (!type) { this._showError('ob-type'); valid = false; }
      if (!address) { this._showError('ob-address'); valid = false; }
      if (type === 'Outro') {
        const customEl = document.getElementById('ob-type-custom-input');
        const custom = customEl.value.trim();
        if (!custom) { this._showError('ob-type-custom'); valid = false; }
        type = custom;
      }
      if (!valid) return;

      Store.saveProfile({ name, serviceType: type, address });
      this._transitionDirection = 'right';
      this._onboardingStep = 2;
      Store.saveOnboardingStep(this._onboardingStep);
      this._renderOnboardingStep();
    } else if (this._onboardingStep === 2) {
      if (this._tempServices.length === 0) {
        const err = document.getElementById('err-ob-services');
        if (err) err.classList.add('show');
        document.getElementById('ob-svc-name').classList.add('error-input');
        document.getElementById('ob-svc-price').classList.add('error-input');
        return;
      }
      const profile = Store.getProfile();
      profile.services = this._tempServices.map((s, i) => ({
        name: s.name,
        price: s.price,
        id: s.id || ('s_' + Date.now() + '_' + i)
      }));
      Store.saveProfile(profile);
      this._transitionDirection = 'right';
      this._onboardingStep = 3;
      Store.saveOnboardingStep(this._onboardingStep);
      this._renderOnboardingStep();
    } else {
      Store.saveProfile({
        notificacoes_profissional: this._obNotifProf,
        notificacoes_clientes: this._obNotifCli
      });
      Store.completeOnboarding();
      Toast.success('Tudo pronto! Bem-vinda ao Agenda Pro! 🎉');
      setTimeout(() => App.navigate('#/agenda'), 500);
    }
  },

  /* ========================================
     TELA 2 — AGENDA DIA
     ======================================== */
  /* ========================================
     TELA 2 — AGENDA (DIA / SEMANA)
     ======================================== */
  _agendaViewMode: 'day', // 'day' ou 'week'
  _currentDate: null,

  agenda() {
    this._currentDate = this._currentDate || DateUtils.today();
    if (this._agendaViewMode === 'day') return this.agendaDay();
    return this.agendaWeek();
  },

  _setAgendaMode(mode) {
    this._agendaViewMode = mode;
    App._updateApp();
  },

  _renderAgendaSwitcher() {
    return `
      <div class="view-switcher">
        <div class="view-btn ${this._agendaViewMode === 'day' ? 'active' : ''}" onclick="Screens._setAgendaMode('day')">Dia</div>
        <div class="view-btn ${this._agendaViewMode === 'week' ? 'active' : ''}" onclick="Screens._setAgendaMode('week')">Semana</div>
      </div>`;
  },

  agendaDay() {
    const date = this._currentDate || DateUtils.today();
    const isToday = DateUtils.isToday(date);
    const dayLabel = DateUtils.formatDateHeader(date);
    
    const appointments = Store.getAppointmentsByDate(date);
    let listHtml = '';

    if (appointments.length === 0) {
      listHtml = `
        <div class="empty-state" style="margin-top:60px">
          <div class="empty-icon">📅</div>
          <h3>Agenda vazia</h3>
          <p>Nenhum compromisso para este dia.</p>
        </div>`;
    } else {
      listHtml = appointments.map(a => {
        const statusClass = `status-${a.status || 'conf'}`;
        const isCancelled = a.status === 'cancelled';
        return `
          <div class="appt-card-v2" onclick="App.navigate('#/appointment/${a.id}')">
            <div class="appt-left">
              <div class="status-dot-mini ${statusClass}"></div>
              <div class="appt-time">${a.time}</div>
            </div>
            <div class="appt-center">
              <span class="appt-client ${isCancelled ? 'strikethrough' : ''}">${a.clientName}</span>
              <span class="appt-svc-small">${a.serviceName}</span>
            </div>
            <div class="appt-right">
              <div class="appt-price-green">R$ ${a.servicePrice.toFixed(2).replace('.', ',')}</div>
            </div>
          </div>`;
      }).join('');
    }

    return `
      <div class="screen fade-fast" style="padding-top:0">
        ${this._renderAgendaSwitcher()}
        <div class="week-nav-header">
          <button class="btn-icon" onclick="Screens._navDate(-1)">${Icons.chevronLeft}</button>
          <div style="text-align:center">
            ${isToday ? '<div style="color:var(--primary); font-size:0.7rem; font-weight:800; text-transform:uppercase; margin-bottom:2px">Hoje</div>' : ''}
            <div class="week-range-text">${isToday ? DateUtils.formatDateOnly(date) : dayLabel}</div>
          </div>
          <button class="btn-icon" onclick="Screens._navDate(1)">${Icons.chevronRight}</button>
        </div>
        <div style="padding: 0 20px 100px">${listHtml}</div>
        <button class="fab" onclick="App.navigate('#/appointment/new')">${Icons.plus}</button>
      </div>`;
  },

  _navDate(days) {
    const d = new Date(this._currentDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    this._currentDate = d.toISOString().split('T')[0];
    App._updateApp();
  },

  agendaWeek() {
    const refDate = this._currentDate || DateUtils.today();
    const dObj = new Date(refDate + 'T12:00:00');
    
    // Encontrar o domingo da semana
    const sun = new Date(dObj);
    sun.setDate(dObj.getDate() - dObj.getDay());
    
    const sat = new Date(sun);
    sat.setDate(sun.getDate() + 6);

    const rangeText = `${DateUtils.formatDateOnly(sun.toISOString().split('T')[0])} — ${DateUtils.formatDateOnly(sat.toISOString().split('T')[0])}`;

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      
      const appts = Store.getAppointmentsByDate(dateStr);
      const count = appts.length;
      
      // Gerar dots baseados nos status (max 3)
      let dotsHtml = '';
      if (count > 0) {
        const displayAppts = appts.slice(0, 3);
        const dots = displayAppts.map(a => {
          const statusClass = `status-${a.status || 'conf'}`;
          return `<div class="dot-indicator ${statusClass}"></div>`;
        }).join('');
        
        dotsHtml = `
          <div class="appt-dots">
            ${count > 3 ? `<span class="plus-n">+${count - 3}</span>` : ''}
            ${dots}
          </div>`;
      } else {
        dotsHtml = `<div class="appt-dots"><div style="width:8px; height:1px; background:rgba(0,0,0,0.1); border-radius:1px"></div></div>`;
      }

      const isToday = dateStr === DateUtils.today();
      const isSelected = dateStr === this._currentDate;
      const dayAbbr = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'][i];

      days.push(`
        <div class="week-card ${isSelected ? 'selected' : ''}" onclick="Screens._selectWeekDate('${dateStr}')">
          <div class="day-abbr">${dayAbbr}</div>
          <div class="day-num">${d.getDate()}</div>
          ${isToday ? '<div class="today-indicator"></div>' : ''}
          ${dotsHtml}
        </div>`);
    }

    return `
      <div class="screen fade-fast" style="padding:0">
        ${this._renderAgendaSwitcher()}
        <div class="week-nav-header">
          <button class="btn-icon" onclick="Screens._navWeek(-7)">${Icons.chevronLeft}</button>
          <div class="week-range-text">${rangeText}</div>
          <button class="btn-icon" onclick="Screens._navWeek(7)">${Icons.chevronRight}</button>
        </div>
        <div class="week-grid-v2">
          ${days.join('')}
        </div>
        <div style="padding: 20px 20px 100px; border-top: 1px solid var(--border-light); background:rgba(0,0,0,0.01)">
          <div style="margin-bottom:20px; font-weight:700; color:var(--text-dim); font-size:0.8rem; text-transform:uppercase">
            Agenda de ${DateUtils.formatDateOnly(this._currentDate)}
          </div>
          ${this._renderDailyList(this._currentDate)}
        </div>
        <button class="fab" onclick="App.navigate('#/appointment/new')">${Icons.plus}</button>
      </div>`;
  },

  _renderDailyList(date) {
    const appointments = Store.getAppointmentsByDate(date);
    if (appointments.length === 0) {
      return `<div class="empty-text-sutil" style="text-align:center; padding:40px 0">Sem compromissos para este dia.</div>`;
    }
    return appointments.map(a => {
      const statusClass = `status-${a.status || 'conf'}`;
      const isCancelled = a.status === 'cancelled';
      return `
        <div class="appt-card-v2" onclick="App.navigate('#/appointment/${a.id}')">
          <div class="appt-left">
            <div class="status-dot-mini ${statusClass}"></div>
            <div class="appt-time">${a.time}</div>
          </div>
          <div class="appt-center">
            <span class="appt-client ${isCancelled ? 'strikethrough' : ''}">${a.clientName}</span>
            <span class="appt-svc-small">${a.serviceName}</span>
          </div>
          <div class="appt-right">
            <div class="appt-price-green">R$ ${a.servicePrice.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>`;
    }).join('');
  },

  _selectWeekDate(date) {
    this._currentDate = date;
    App._updateApp();
  },

  _navWeek(days) {
    const d = new Date(this._currentDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    this._currentDate = d.toISOString().split('T')[0];
    App._updateApp();
  },

  /* ========================================
     TELA 4 — NOVO / EDITAR AGENDAMENTO
     ======================================== */
  _selectedServiceIds: [],

  appointmentForm(editId) {
    const services = Store.getServices();
    const isEdit = !!editId;
    let appt = { date: this._currentDate || DateUtils.today(), time: '09:00', serviceIds: [], clientName: '', clientPhone: '' };

    if (isEdit) {
      const existing = Store.getAppointment(editId);
      if (existing) {
        appt = existing;
        this._selectedServiceIds = appt.serviceIds || [appt.serviceId];
      }
    } else {
      this._selectedServiceIds = [];
    }

    const servicesListHtml = services.map(s => {
      const active = this._selectedServiceIds.includes(s.id) ? 'active' : '';
      return `
        <div class="service-select-item ${active}" id="svc-${s.id}" onclick="Screens._toggleService('${s.id}')">
          <div>
            <div class="svc-name">${s.name}</div>
            <div class="svc-price">R$ ${s.price.toFixed(2).replace('.', ',')}</div>
          </div>
          <div class="svc-check">${Icons.check}</div>
        </div>`;
    }).join('');

    const totalPrice = services
      .filter(s => this._selectedServiceIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    const [h, m] = appt.time.split(':');
    const hours = Array.from({ length: 17 }, (_, i) => String(i + 6).padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    return `
      <div class="screen fade-fast">
        <div class="screen-header">
          <button class="back-btn" onclick="history.back()">${Icons.back}</button>
          <h2>${isEdit ? 'Editar' : 'Novo'} Agendamento</h2>
        </div>
        <div class="form-screen" style="padding:0 20px">
          <div class="input-group">
            <label>Data</label>
            <div class="custom-picker-container">
              <input type="text" id="form-date-display" value="${DateUtils.formatDateFull(appt.date)}" readonly onclick="Screens._toggleCalendar()" style="cursor:pointer">
              <input type="hidden" id="form-date" value="${appt.date}">
              <div id="mini-calendar" class="mini-calendar">${CalendarPicker.render(appt.date, (d) => Screens._updateSelectedDate(d))}</div>
            </div>
          </div>
          
          <div class="input-group">
            <label>Horário</label>
            <div class="time-dropdowns">
              <select id="form-hour" onchange="Screens._checkConflict('${editId || ''}')">
                ${hours.map(opt => `<option value="${opt}" ${opt === h ? 'selected' : ''}>${opt}h</option>`).join('')}
              </select>
              <select id="form-min" onchange="Screens._checkConflict('${editId || ''}')">
                ${minutes.map(opt => `<option value="${opt}" ${opt === m ? 'selected' : ''}>${opt}m</option>`).join('')}
              </select>
            </div>
            <div id="conflict-msg" class="error-msg" style="color:var(--warning); margin-top:8px"></div>
          </div>

          <div class="input-group">
            <label>Serviços</label>
            <div class="service-selection-list">
              ${servicesListHtml}
            </div>
            <div class="total-preview" id="form-total-preview">
              <span>Total:</span>
              <span style="color:var(--success)">R$ ${totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          <div class="input-group">
            <label>Nome da cliente</label>
            <input type="text" id="form-client" placeholder="Ex: Maria Clara" value="${appt.clientName || ''}">
          </div>
          <div class="input-group">
            <label>Telefone (WhatsApp)</label>
            <input type="tel" id="form-phone" placeholder="(11) 99999-9999" value="${appt.clientPhone || ''}" oninput="PhoneMask.apply(this)">
          </div>
          <button class="btn btn-primary btn-block" id="btn-save-appt" onclick="Screens._saveAppointment('${editId || ''}')">
            ${isEdit ? 'Salvar alterações' : 'Criar agendamento'} ✓
          </button>
        </div>
      </div>`;
  },

  _toggleCalendar() {
    document.getElementById('mini-calendar').classList.toggle('show');
  },

  _updateSelectedDate(date) {
    document.getElementById('form-date').value = date;
    document.getElementById('form-date-display').value = DateUtils.formatDateFull(date);
    this._checkConflict();
  },

  _checkConflict(editId) {
    const date = document.getElementById('form-date').value;
    const h = document.getElementById('form-hour').value;
    const m = document.getElementById('form-min').value;
    const time = `${h}:${m}`;
    const msgEl = document.getElementById('conflict-msg');
    const btn = document.getElementById('btn-save-appt');

    const appointments = Store.getAppointmentsByDate(date);
    const conflict = appointments.find(a => a.time === time && a.id !== editId);

    if (conflict) {
      msgEl.innerText = `Horário ocupado — ${conflict.clientName} está agendada para ${time}.`;
      msgEl.style.display = 'block';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else {
      msgEl.style.display = 'none';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  },

  _toggleService(id) {
    const index = this._selectedServiceIds.indexOf(id);
    if (index > -1) {
      this._selectedServiceIds.splice(index, 1);
    } else {
      this._selectedServiceIds.push(id);
    }

    // Atualizar UI
    const services = Store.getServices();
    const totalPrice = services
      .filter(s => this._selectedServiceIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    document.getElementById(`svc-${id}`).classList.toggle('active');
    document.getElementById('form-total-preview').innerHTML = `
      <span>Total:</span>
      <span style="color:var(--success)">R$ ${totalPrice.toFixed(2).replace('.', ',')}</span>
    `;
  },

  _saveAppointment(editId) {
    const date = document.getElementById('form-date').value;
    const h = document.getElementById('form-hour').value;
    const m = document.getElementById('form-min').value;
    const time = `${h}:${m}`;
    const clientName = document.getElementById('form-client').value.trim();
    const clientPhone = document.getElementById('form-phone').value.trim();

    if (!date) { Toast.error('Selecione a data'); return; }
    if (this._selectedServiceIds.length === 0) { Toast.error('Selecione pelo menos um serviço'); return; }
    if (!clientName) { Toast.error('Digite o nome da cliente'); return; }

    const services = Store.getServices();
    const selectedServices = services.filter(s => this._selectedServiceIds.includes(s.id));

    const svcNames = selectedServices.map(s => s.name);
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    const apptData = {
      date, time, clientName, clientPhone,
      serviceIds: this._selectedServiceIds,
      serviceName: svcNames.join(' + '),
      servicePrice: totalPrice
    };

    if (editId) {
      Store.updateAppointment(editId, apptData);
      Toast.success('Agendamento atualizado! ✓');
    } else {
      Store.addAppointment(apptData);
      Toast.success('Agendamento criado! 🎉');
    }
    this._currentDate = date;
    setTimeout(() => App.navigate('#/agenda'), 400);
  },

  /* ========================================
     TELA 5 — DETALHE DO AGENDAMENTO
     ======================================== */
  _selectedTemplate: 't2',

  appointmentDetail(id) {
    const appt = Store.getAppointment(id);
    if (!appt) return '<div class="screen"><p>Agendamento não encontrado.</p></div>';

    const svcName = appt.serviceName || 'Serviço';
    const price = appt.servicePrice || 0;
    const status = appt.status || 'conf';

    const templates = Store.getTemplates();
    const templatesHtml = templates.map(t => {
      const sel = t.id === this._selectedTemplate ? 'selected' : '';
      return `
        <div class="template-option ${sel}" onclick="Screens._selectedTemplate='${t.id}'; App._updateApp()">
          <div class="radio"></div>
          <span>${t.name}</span>
        </div>`;
    }).join('');

    const msgText = WhatsApp.buildMessage(this._selectedTemplate, appt);

    const statusOptions = [
      { id: 'conf', label: '🔵 Confirmado', class: 'conf' },
      { id: 'wait', label: '🟡 Aguardando', class: 'wait' },
      { id: 'pres', label: '🟢 Presente', class: 'pres' },
      { id: 'canc', label: '🔴 Cancelado', class: 'canc' }
    ];

    const statusChips = statusOptions.map(opt => `
      <div class="status-chip ${opt.class} ${status === opt.id ? 'active' : ''}" onclick="Screens._updateApptStatus('${id}', '${opt.id}')">
        ${opt.label}
      </div>
    `).join('');

    return `
      <div class="screen fade-fast" style="padding:0">
        <div class="screen-header" style="padding: 20px 20px 10px">
          <button class="back-btn" onclick="App.navigate('#/agenda')">${Icons.back}</button>
          <h2>Detalhes</h2>
        </div>

        <div class="status-chips">
          ${statusChips}
        </div>

        <div class="card" style="margin: 0 20px 24px; padding: 20px">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px">
            <div>
              <h3 style="font-size:1.2rem; margin-bottom:4px">${appt.clientName}</h3>
              <p style="color:var(--text-dim); font-size:0.85rem">${appt.clientPhone || 'Sem telefone'}</p>
            </div>
            <div style="text-align:right">
              <div style="font-weight:800; font-size:1.1rem; color:var(--primary)">${appt.time}</div>
              <div style="font-size:0.75rem; color:var(--text-dim)">${DateUtils.formatDateShort(appt.date)}</div>
            </div>
          </div>
          <div style="padding-top:16px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center">
            <div style="font-weight:600">${svcName}</div>
            <div style="font-weight:800; color:var(--success)">R$ ${price.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div class="compact-actions">
          <button class="action-btn btn-wa-compact" onclick="WhatsApp.send('${appt.clientPhone}','${this._selectedTemplate}',Store.getAppointment('${id}'))">
            ${Icons.whatsapp}
            <span>WhatsApp</span>
          </button>
          <button class="action-btn btn-edit-compact" onclick="App.navigate('#/appointment/${appt.id}/edit')">
            ${Icons.edit}
            <span>Editar</span>
          </button>
          <button class="action-btn btn-del-compact" onclick="Screens._confirmCancel('${appt.id}', '${appt.clientName}')">
            ${Icons.trash}
            <span>Cancelar</span>
          </button>
        </div>

        <div style="padding: 0 20px">
          <h4 style="margin-bottom:12px; font-size:0.9rem">Mensagem de lembrete</h4>
          <div class="template-list" style="margin-bottom:16px">
            ${templatesHtml}
          </div>
        </div>

        <div class="msg-preview-container">
          <div class="msg-preview-v2">
            ${msgText.replace(/\n/g, '<br>')}
          </div>
          <button class="btn-copy" onclick="Screens._copyMsgText(\`${msgText}\`)">Copiar texto</button>
        </div>
      </div>`;
  },

  _updateApptStatus(id, status) {
    Store.updateStatus(id, status);
    App._updateApp();
  },

  _confirmCancel(id, name) {
    BottomSheet.show(`Cancelar atendimento de ${name}?`, [
      { id: 'no', label: 'Não, voltar', class: 'btn-ghost' },
      {
        id: 'yes', label: 'Sim, cancelar', class: 'btn-danger', onClick: () => {
          Store.updateStatus(id, 'cancelled');
          App._updateApp();
          Toast.success('Agendamento cancelado.');
        }
      }
    ]);
  },

  _copyMsgText(text) {
    navigator.clipboard.writeText(text).then(() => {
      Toast.success('Texto copiado! 📋');
    });
  },

  /* ========================================
     TELA 6 — CONFIGURAÇÕES
     ======================================== */
  settings() {
    const profile = Store.getProfile();
    const services = Store.getServices();
    const plan = Store.getPlan();

    const servicesHtml = services.map(s => `
      <div class="service-item">
        <span class="service-name">${s.name}</span>
        <span class="service-price">R$ ${s.price.toFixed(2)}</span>
        <button class="service-remove" onclick="Screens._removeSettingsService('${s.id}')">✕</button>
      </div>`).join('');

    return `
      <div class="screen-header" style="padding-top:calc(24px + var(--safe-top))">
        <h2>Configurações</h2>
        <span class="badge ${plan === 'pro' ? 'badge-pro' : 'badge-primary'}">${plan === 'pro' ? 'PRO' : 'Gratuito'}</span>
      </div>
      <div class="screen">
        <div class="settings-section">
          <h3>Perfil</h3>
          <div class="card" style="margin-bottom:12px">
            <div class="input-group" style="margin-bottom:12px">
              <label>Nome</label>
              <input type="text" id="set-name" value="${profile.name}">
            </div>
            <div class="input-group" style="margin-bottom:12px">
              <label>Tipo de serviço</label>
              <input type="text" id="set-type" value="${profile.serviceType}" readonly style="opacity:.7">
            </div>
            <div class="input-group" style="margin-bottom:0">
              <label>Endereço</label>
              <input type="text" id="set-address" value="${profile.address || ''}">
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Serviços e Preços</h3>
          <div id="settings-services">${servicesHtml}</div>
          <div style="display:flex;gap:8px;margin-top:12px">
            <div class="input-group" style="flex:1;margin:0">
              <input type="text" id="set-svc-name" placeholder="Novo serviço">
            </div>
            <div class="input-group" style="width:100px;margin:0">
              <input type="number" id="set-svc-price" placeholder="Preço" step="0.01">
            </div>
            <button class="btn btn-secondary btn-sm" onclick="Screens._addSettingsService()">+</button>
          </div>
        </div>

        <div class="settings-section">
          <h3>Notificações</h3>
          <div class="card">
            <div class="toggle">
              <span>1 dia antes</span>
              <div class="toggle-track ${profile.notifications?.dayBefore ? 'active' : ''}" id="set-notif-day" onclick="this.classList.toggle('active'); Screens._saveNotifSettings()"></div>
            </div>
            <div class="toggle">
              <span>2 horas antes</span>
              <div class="toggle-track ${profile.notifications?.hoursBefore ? 'active' : ''}" id="set-notif-hours" onclick="this.classList.toggle('active'); Screens._saveNotifSettings()"></div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
            <h3 style="margin:0">Modelos de Mensagem</h3>
            <button class="btn btn-secondary btn-sm" onclick="Screens._addNewTemplate()">+ Novo</button>
          </div>
          <div id="templates-container">
            ${Store.getTemplates().map(t => this._renderTemplateCard(t)).join('')}
          </div>
        </div>

        <div class="settings-section">
          <button class="btn btn-primary btn-block" onclick="Screens._saveProfileSettings()">Salvar Perfil</button>
        </div>

        <div class="settings-section" style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
          <h3>Conta</h3>
          <button class="btn btn-danger btn-block" onclick="Screens._confirmLogout()">
            Sair da conta
          </button>
          <p style="text-align:center;font-size:.75rem;margin-top:8px">Ao sair, seus dados serão apagados deste dispositivo.</p>
        </div>
      </div>`;
  },

  _confirmLogout() {
    Modal.confirm(
      'Sair da conta?',
      'Todos os seus dados (agendamentos, serviços, configurações) serão apagados deste dispositivo. Deseja continuar?',
      () => {
        Store.reset();
        Toast.success('Até logo! 👋');
        setTimeout(() => App.navigate('#/onboarding'), 500);
      }
    );
  },

  _addSettingsService() {
    const name = document.getElementById('set-svc-name').value.trim();
    const price = parseFloat(document.getElementById('set-svc-price').value);
    if (!name || isNaN(price) || price <= 0) { Toast.error('Preencha nome e preço'); return; }
    Store.addService(name, price);
    Toast.success(`${name} adicionado!`);
    App._updateApp();
  },

  _removeSettingsService(id) {
    Store.removeService(id);
    Toast.success('Serviço removido');
    App._updateApp();
  },

  _saveNotifSettings() {
    const dayBefore = document.getElementById('set-notif-day').classList.contains('active');
    const hoursBefore = document.getElementById('set-notif-hours').classList.contains('active');
    Store.saveProfile({ notifications: { dayBefore, hoursBefore } });
  },

  _saveProfileSettings() {
    const name = document.getElementById('set-name').value.trim();
    const address = document.getElementById('set-address').value.trim();
    if (!name) { Toast.error('Digite seu nome'); return; }
    Store.saveProfile({ name, address });

    // Salvar Templates existentes
    const templates = Store.getTemplates().map(t => {
      const editor = document.getElementById(`editor-${t.id}`);
      return {
        ...t,
        text: editor ? this._getEditorText(editor) : t.text
      };
    });
    Store.saveTemplates(templates);

    Toast.success('Configurações salvas! ✓');
    App._updateApp();
  },

  _addNewTemplate() {
    const id = Store.addTemplate('Novo Modelo de Mensagem', 'Olá [nome], passando para confirmar seu [serviço] no dia [dia] às [hora].');
    App._updateApp();
    setTimeout(() => {
      const card = document.getElementById(`card-${id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
        this._toggleTemplateCard(id);
      }
    }, 300);
  },

  _saveTemplateTitle(id) {
    const titleEl = document.getElementById(`title-${id}`);
    const name = titleEl.innerText.trim();
    const templates = Store.getTemplates();
    const idx = templates.findIndex(t => t.id === id);
    if (idx > -1) {
      templates[idx].name = name;
      Store.saveTemplates(templates);
    }
  },

  _deleteTemplate(id) {
    event.stopPropagation();
    BottomSheet.show('Excluir este modelo?', [
      { id: 'no', label: 'Não, manter', class: 'btn-ghost' },
      {
        id: 'yes', label: 'Sim, excluir', class: 'btn-danger', onClick: () => {
          Store.deleteTemplate(id);
          App._updateApp();
          Toast.success('Modelo removido.');
        }
      }
    ]);
  },

  _restoreDefaultTemplate(id) {
    const defaults = {
      't1': 'Oi [nome]! Tudo certo, seu horário de [serviço] está confirmado para [dia] às [hora]. Qualquer coisa é só chamar! 😊',
      't2': 'Oi [nome]! Passando pra lembrar do seu [serviço] amanhã às [hora]. Te espero! 💅',
      't3': 'Perfeito! Te aguardo amanhã. 😘'
    };

    const editor = document.getElementById(`editor-${id}`);
    const text = defaults[id] || 'Olá [nome], confirmando seu agendamento.';

    const htmlContent = text.replace(/\[(nome|serviço|dia|hora|valor)\]/g,
      '<span class="var-chip" contenteditable="false">[$1]</span>');

    if (editor) {
      editor.innerHTML = htmlContent;
      this._onEditorInput(id);
    }
    Toast.success('Modelo restaurado ao padrão.');
  },

  /* --- SMART EDITOR METHODS --- */

  _renderTemplateCard(t) {
    const text = t.text || '';
    const snippet = text.replace(/\[(.*?)\]/g, '$1').substring(0, 40) + '...';

    // Transform text to HTML with chips for initial render
    const htmlContent = text.replace(/\[(nome|serviço|dia|hora|valor|endereço)\]/g,
      '<span class="var-chip" contenteditable="false">[$1]</span>');

    return `
      <div class="template-card" id="card-${t.id}">
        <div class="template-card-header" onclick="Screens._toggleTemplateCard('${t.id}')">
          <div style="flex:1">
            <div style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase; font-weight:700; margin-bottom:4px">Para que serve:</div>
            <div style="display:flex; align-items:center; gap:8px">
              <h4 id="title-${t.id}" contenteditable="${!t.isDefault}" onblur="Screens._saveTemplateTitle('${t.id}')" style="margin:0; flex:1">${t.name}</h4>
              ${!t.isDefault ? `<button class="btn-icon" style="padding:4px; color:var(--danger); width:32px; height:32px" onclick="Screens._deleteTemplate('${t.id}')">${Icons.trash}</button>` : ''}
            </div>
            <div class="preview-snippet" id="snippet-${t.id}">${snippet}</div>
          </div>
          <div id="arrow-${t.id}">${Icons.chevronRight}</div>
        </div>
        
        <div class="template-card-content">
          <div style="display:flex; justify-content:flex-end">
            ${t.isDefault ? `<button class="btn-ghost" style="font-size:0.65rem; padding:4px 8px" onclick="Screens._restoreDefaultTemplate('${t.id}')">Restaurar padrão</button>` : ''}
          </div>
          
          <div class="editor-smart" id="editor-${t.id}" contenteditable="true" 
               oninput="Screens._onEditorInput('${t.id}')"
               onfocus="Screens._onEditorFocus('${t.id}')">${htmlContent}</div>
          
          <div class="editor-footer">
            <div id="char-count-${t.id}">${text.length} caracteres</div>
            <div class="save-status" id="save-status-${t.id}"></div>
          </div>

          <div class="var-buttons">
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'nome')">+ nome</button>
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'serviço')">+ serviço</button>
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'dia')">+ dia</button>
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'hora')">+ hora</button>
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'valor')">+ valor</button>
            <button class="var-btn" onclick="Screens._insertVar('${t.id}', 'endereço')">+ endereço</button>
          </div>

          <div class="wa-preview-container">
            <div class="wa-preview-header">${Icons.whatsapp} Como vai aparecer:</div>
            <div class="wa-bubble" id="preview-${t.id}"></div>
          </div>
        </div>
      </div>`;
  },

  _toggleTemplateCard(id) {
    const card = document.getElementById(`card-${id}`);
    const isExpanded = card.classList.contains('expanded');

    // Close others
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('expanded'));

    if (!isExpanded) {
      card.classList.add('expanded');
      document.getElementById(`arrow-${id}`).innerHTML = Icons.chevronLeft;
      this._updatePreview(id);
    } else {
      document.getElementById(`arrow-${id}`).innerHTML = Icons.chevronRight;
    }
  },

  _onEditorFocus(id) {
    this._lastActiveEditor = id;
  },

  _insertVar(tplId, varKey) {
    const editor = document.getElementById(`editor-${tplId}`);
    editor.focus();

    const chipHtml = `<span class="var-chip" contenteditable="false">[${varKey}]</span>&nbsp;`;
    document.execCommand('insertHTML', false, chipHtml);

    this._onEditorInput(tplId);
  },

  _onEditorInput(id) {
    const editor = document.getElementById(`editor-${id}`);
    let text = this._getEditorText(editor);

    // Update char count
    document.getElementById(`char-count-${id}`).innerText = `${text.length} caracteres`;

    // Validate manual variables (detect typos like [Nome] or [nomes])
    this._validateEditorText(editor);

    // Update snippet in header
    const snippet = text.replace(/\[(.*?)\]/g, '$1').substring(0, 40) + '...';
    document.getElementById(`snippet-${id}`).innerText = snippet;

    // Update preview
    this._updatePreview(id);

    // Auto save debounce
    this._debounceSave(id, text);
  },

  _getEditorText(editor) {
    let temp = document.createElement('div');
    temp.innerHTML = editor.innerHTML;

    // Replace chips with text version
    temp.querySelectorAll('.var-chip').forEach(chip => {
      chip.outerHTML = chip.innerText;
    });

    return temp.innerText.trim();
  },

  _validateEditorText(editor) {
    // Basic validation for common typos
    const content = editor.innerHTML;
    const regex = /\[(Nome|Nomes|Serviço|Servicos|Dia|Hora|Valor|nome|serviço|dia|hora|valor).*?\]/g;
    // For now we just check if it matches our keys. If it doesn't match exactly the lower case one, we could highlight.
    // This is complex in contenteditable without breaking the cursor. 
    // We'll skip the wavy underline for now to keep it stable, but the logic is ready.
  },

  _updatePreview(id) {
    const editor = document.getElementById(`editor-${id}`);
    const text = this._getEditorText(editor);

    const profile = Store.getProfile();
    const myAddress = profile.address || 'Seu endereço não cadastrado';

    const previewText = text
      .replace(/\[nome\]/g, '<b>Maria Clara</b>')
      .replace(/\[serviço\]/g, '<b>Manicure</b>')
      .replace(/\[dia\]/g, '<b>sexta-feira, 16/05</b>')
      .replace(/\[hora\]/g, '<b>10:00</b>')
      .replace(/\[valor\]/g, '<b>R$ 45,00</b>')
      .replace(/\[endereço\]/g, `<b>${myAddress}</b>`);

    document.getElementById(`preview-${id}`).innerHTML = previewText.replace(/\n/g, '<br>');
  },

  _saveTimeouts: {},
  _debounceSave(id, text) {
    const statusEl = document.getElementById(`save-status-${id}`);
    statusEl.innerText = 'Salvando...';

    if (this._saveTimeouts[id]) clearTimeout(this._saveTimeouts[id]);

    this._saveTimeouts[id] = setTimeout(() => {
      const templates = Store.getTemplates();
      const idx = templates.findIndex(t => t.id === id);
      if (idx > -1) {
        templates[idx].text = text;
        Store.saveTemplates(templates);
        statusEl.innerHTML = 'Salvo ✓';
        setTimeout(() => { if (statusEl.innerText === 'Salvo ✓') statusEl.innerText = ''; }, 2000);
      }
    }, 2000);
  },

  _restoreDefaultTemplate(id) {
    const defaults = {
      't1': 'Oi [nome]! Tudo certo, seu horário de [serviço] está confirmado para [dia] às [hora]. Qualquer coisa é só chamar! 😊',
      't2': 'Oi [nome]! Passando pra lembrar do seu [serviço] amanhã às [hora]. Te espero! 💅',
      't3': 'Perfeito! Te aguardo amanhã. 😘'
    };

    const editor = document.getElementById(`editor-${id}`);
    const text = defaults[id] || '';
    const htmlContent = text.replace(/\[(nome|serviço|dia|hora|valor|endereço)\]/g,
      '<span class="var-chip" contenteditable="false">[$1]</span>');

    editor.innerHTML = htmlContent;
    this._onEditorInput(id);
    Toast.success('Modelo restaurado ao padrão.');
  },

  /* ========================================
     TELA 7 — UPGRADE PRO
     ======================================== */
  upgrade() {
    return `
      <div class="upgrade-hero">
        <span class="hero-emoji">✨</span>
        <h1>Agenda Pro</h1>
        <p>Leve seu negócio ao próximo nível</p>
      </div>
      <div class="plan-cards">
        <div class="card plan-card">
          <div class="plan-name">Gratuito</div>
          <div class="plan-price">R$ 0 <span>/mês</span></div>
          <ul class="plan-features">
            <li>Até 30 agendamentos/mês</li>
            <li>Até 20 clientes</li>
            <li>Notificações configuráveis</li>
            <li>Lembrete via link WhatsApp</li>
            <li>2 templates de mensagem</li>
            <li class="disabled">Mensagens automáticas</li>
            <li class="disabled">Templates editáveis ilimitados</li>
            <li class="disabled">Histórico de clientes</li>
            <li class="disabled">Suporte prioritário</li>
          </ul>
        </div>
        <div class="card plan-card recommended">
          <div class="plan-name" style="color:var(--primary-light)">Pro</div>
          <div class="plan-price">R$ 29 <span>/mês</span></div>
          <ul class="plan-features">
            <li>Agendamentos ilimitados</li>
            <li>Clientes ilimitados</li>
            <li>Notificações configuráveis</li>
            <li>Lembrete via link WhatsApp</li>
            <li>150 mensagens automáticas/mês</li>
            <li>Templates editáveis ilimitados</li>
            <li>Histórico de clientes</li>
            <li>Suporte prioritário</li>
          </ul>
          <button class="btn btn-primary btn-block" style="margin-top:20px;animation:pulse 2s infinite" onclick="Toast.success('Em breve! Estamos preparando o plano Pro para você 🚀')">
            Assinar Pro — R$ 29/mês
          </button>
        </div>
      </div>
      <div style="text-align:center;padding:24px 20px 40px">
        <p style="font-size:.8rem">Cancele quando quiser. Sem fidelidade.</p>
      </div>`;
  }
};
