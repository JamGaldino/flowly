/* ===== DATE UTILS ===== */
const DateUtils = {
  DAYS: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  DAYS_SHORT: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  MONTHS: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],

  today() { return this.toDateStr(new Date()); },
  toDateStr(d) { const dd = new Date(d); return `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`; },
  fromDateStr(s) { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); },

  addDays(dateStr, n) {
    const d = this.fromDateStr(dateStr);
    d.setDate(d.getDate() + n);
    return this.toDateStr(d);
  },

  formatDateFull(dateStr) {
    const d = this.fromDateStr(dateStr);
    return `${d.getDate()} de ${this.MONTHS[d.getMonth()]}`;
  },

  formatDateShort(dateStr) {
    const d = this.fromDateStr(dateStr);
    return `${d.getDate()} ${this.MONTHS[d.getMonth()].substring(0,3)}`;
  },

  formatDateHeader(dateStr) {
    const d = this.fromDateStr(dateStr);
    if (this.isToday(dateStr)) return 'Hoje';
    return `${d.getDate()} de ${this.MONTHS[d.getMonth()]}`;
  },

  getWeekDays(dateStr) {
    const d = this.fromDateStr(dateStr);
    const dayOfWeek = d.getDay();
    const monday = this.addDays(dateStr, -((dayOfWeek + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => this.addDays(monday, i));
  },

  isToday(dateStr) { return dateStr === this.today(); },

  formatDateOnly(dateStr) {
    const d = this.fromDateStr(dateStr);
    return `${d.getDate()} de ${this.MONTHS[d.getMonth()]}`;
  }
};

/* ===== ICONS (SVG) ===== */
const Icons = {
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>'
};

/* ===== TOAST ===== */
const Toast = {
  show(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(-10px)'; toast.style.transition = 'all .3s'; }, 2500);
    setTimeout(() => toast.remove(), 2800);
  },
  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); }
};

/* ===== MODAL ===== */
const Modal = {
  show(title, bodyHtml, actions = []) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    const actionsHtml = actions.map(a =>
      `<button class="btn ${a.class || 'btn-secondary'} btn-block" onclick="${a.onclick}">${a.label}</button>`
    ).join('');
    overlay.innerHTML = `
      <div class="modal-content">
        <h3>${title}</h3>
        <div style="margin-bottom:20px">${bodyHtml}</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${actionsHtml}
          <button class="btn btn-secondary btn-block" onclick="Modal.close()">Cancelar</button>
        </div>
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) Modal.close(); });
    document.body.appendChild(overlay);
  },
  close() { const o = document.getElementById('modal-overlay'); if (o) o.remove(); },

  confirm(title, message, onConfirm) {
    this.show(title, `<p>${message}</p>`, [
      { label: 'Confirmar', class: 'btn-danger', onclick: `Modal.close(); (${onConfirm.toString()})()` }
    ]);
  }
};

/* ===== NAVBAR ===== */
const Navbar = {
  render(activeTab) {
    return `
    <nav class="bottom-nav" id="bottom-nav">
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
      </button>
    </nav>`;
  }
};

/* ===== PHONE MASK ===== */
const PhoneMask = {
  apply(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      input.value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      input.value = `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      input.value = `(${value.slice(0,2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      input.value = `(${value}`;
    }
  }
};

/* ===== BOTTOM SHEET ===== */
const BottomSheet = {
  show(title, buttons) {
    const overlay = document.createElement('div');
    overlay.className = 'bottom-sheet-overlay';
    overlay.id = 'bottom-sheet-overlay';
    
    const btnsHtml = buttons.map(b => `
      <button class="btn ${b.class}" id="bs-btn-${b.id}">${b.label}</button>
    `).join('');

    overlay.innerHTML = `
      <div class="bottom-sheet">
        <h3>${title}</h3>
        <div class="bottom-sheet-btns">${btnsHtml}</div>
      </div>`;

    document.body.appendChild(overlay);
    
    buttons.forEach(b => {
      document.getElementById(`bs-btn-${b.id}`).onclick = () => {
        this.hide();
        if (b.onClick) b.onClick();
      };
    });

    overlay.onclick = (e) => { if (e.target === overlay) this.hide(); };
  },
  hide() {
    const el = document.getElementById('bottom-sheet-overlay');
    if (el) el.remove();
  }
};

/* ===== CALENDAR PICKER ===== */
const CalendarPicker = {
  render(currentDate, onSelect) {
    const d = DateUtils.fromDateStr(currentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    
    const monthName = DateUtils.MONTHS[month];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let daysHtml = '';
    for (let i = 0; i < firstDay; i++) daysHtml += '<div class="cal-day disabled"></div>';
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
      const active = dateStr === currentDate ? 'active' : '';
      daysHtml += `<div class="cal-day ${active}" onclick="CalendarPicker._select('${dateStr}')">${i}</div>`;
    }

    const html = `
      <div class="cal-header">
        <button onclick="CalendarPicker._changeMonth('${currentDate}', -1); event.stopPropagation();">${Icons.chevronLeft}</button>
        <span style="text-transform:capitalize">${monthName} ${year}</span>
        <button onclick="CalendarPicker._changeMonth('${currentDate}', 1); event.stopPropagation();">${Icons.chevronRight}</button>
      </div>
      <div class="cal-grid">
        <div class="cal-day disabled">D</div><div class="cal-day disabled">S</div>
        <div class="cal-day disabled">T</div><div class="cal-day disabled">Q</div>
        <div class="cal-day disabled">Q</div><div class="cal-day disabled">S</div>
        <div class="cal-day disabled">S</div>
        ${daysHtml}
      </div>`;
    
    this._onSelect = onSelect;
    return html;
  },
  _select(date) {
    if (this._onSelect) this._onSelect(date);
    const el = document.getElementById('mini-calendar');
    if (el) el.classList.remove('show');
  },
  _changeMonth(current, delta) {
    const d = DateUtils.fromDateStr(current);
    d.setMonth(d.getMonth() + delta);
    const newDate = DateUtils.toDateStr(d);
    const el = document.getElementById('mini-calendar');
    if (el) el.innerHTML = this.render(newDate, this._onSelect);
  }
};
