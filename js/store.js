/* ===== STORE — Gerenciamento de Estado com localStorage ===== */
const Store = {
  _key: 'agenda-pro-data',

  _defaults() {
    return {
      profile: { 
        name: '', 
        serviceType: '', 
        address: '',
        services: [], 
        notificacoes_profissional: ['1 dia antes'],
        notificacoes_clientes: ['1 dia antes']
      },
      appointments: [],
      templates: [
        { id: 't1', name: 'Confirmação de agendamento', text: 'Oi [nome]! Tudo certo, seu horário de [serviço] está confirmado para [dia] às [hora]. Qualquer coisa é só chamar! 😊', isDefault: true },
        { id: 't2', name: 'Lembrete 24h antes', text: 'Oi [nome]! Passando pra lembrar do seu [serviço] amanhã às [hora]. Te espero! 💅', isDefault: true },
        { id: 't3', name: 'Confirmação de presença', text: 'Perfeito! Te aguardo amanhã. 😘', isDefault: true }
      ],
      settings: { plan: 'free', onboardingDone: false, onboardingStep: 1 }
    };
  },

  _load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (!raw) return this._defaults();
      const data = JSON.parse(raw);
      const defaults = this._defaults();
      return {
        profile: { ...defaults.profile, ...data.profile },
        appointments: data.appointments || [],
        templates: data.templates || defaults.templates,
        settings: { ...defaults.settings, ...data.settings }
      };
    } catch { return this._defaults(); }
  },

  _save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  /* Profile */
  getProfile() { return this._load().profile; },
  saveProfile(profile) { const d = this._load(); d.profile = { ...d.profile, ...profile }; this._save(d); },

  /* Onboarding */
  isOnboardingDone() { return this._load().settings.onboardingDone; },
  completeOnboarding() { const d = this._load(); d.settings.onboardingDone = true; this._save(d); },
  getOnboardingStep() { return this._load().settings.onboardingStep || 1; },
  saveOnboardingStep(step) { const d = this._load(); d.settings.onboardingStep = step; this._save(d); },

  /* Appointments */
  getAppointments() { return this._load().appointments; },
  getAppointment(id) { return this._load().appointments.find(a => a.id === id); },

  getAppointmentsByDate(dateStr) {
    return this._load().appointments
      .filter(a => a.date === dateStr && a.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  addAppointment(appt) {
    const d = this._load();
    appt.id = 'appt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    appt.status = appt.status || 'confirmed';
    appt.createdAt = new Date().toISOString();
    d.appointments.push(appt);
    this._save(d);
    return appt;
  },

  updateStatus(id, status) {
    this.updateAppointment(id, { status });
  },

  updateAppointment(id, updates) {
    const d = this._load();
    const idx = d.appointments.findIndex(a => a.id === id);
    if (idx >= 0) { d.appointments[idx] = { ...d.appointments[idx], ...updates }; this._save(d); }
  },

  cancelAppointment(id) { this.updateAppointment(id, { status: 'cancelled' }); },

  deleteAppointment(id) {
    const d = this._load();
    d.appointments = d.appointments.filter(a => a.id !== id);
    this._save(d);
  },

  countAppointmentsByDate(dateStr) {
    return this._load().appointments.filter(a => a.date === dateStr && a.status !== 'cancelled').length;
  },

  /* Templates */
  getTemplates() { return this._load().templates; },
  getTemplate(id) { return this._load().templates.find(t => t.id === id); },
  saveTemplates(templates) { const d = this._load(); d.templates = templates; this._save(d); },
  
  addTemplate(name, text) {
    const d = this._load();
    const id = 't_' + Date.now();
    d.templates.push({ id, name, text, isDefault: false });
    this._save(d);
    return id;
  },

  deleteTemplate(id) {
    const d = this._load();
    d.templates = d.templates.filter(t => t.id !== id);
    this._save(d);
  },

  /* Services */
  getServices() { return this._load().profile.services || []; },
  addService(name, price) {
    const d = this._load();
    d.profile.services.push({ id: 's_' + Date.now(), name, price: parseFloat(price) });
    this._save(d);
  },
  removeService(id) {
    const d = this._load();
    d.profile.services = d.profile.services.filter(s => s.id !== id);
    this._save(d);
  },

  /* Settings */
  getSettings() { return this._load().settings; },
  getPlan() { return this._load().settings.plan; },

  /* Reset */
  reset() { localStorage.removeItem(this._key); }
};
