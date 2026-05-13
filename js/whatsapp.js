/* ===== WHATSAPP — Templates e Links wa.me ===== */
const WhatsApp = {
  /* Gera link wa.me com mensagem pré-preenchida */
  generateLink(phone, message) {
    const cleaned = phone.replace(/\D/g, '');
    const fullPhone = cleaned.startsWith('55') ? cleaned : '55' + cleaned;
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${fullPhone}?text=${encoded}`;
  },

  /* Substitui variáveis no template */
  fillTemplate(templateText, data) {
    return templateText
      .replace(/\[nome\]/gi, data.clientName || '')
      .replace(/\[serviço\]/gi, data.serviceName || '')
      .replace(/\[dia\]/gi, data.dateFormatted || '')
      .replace(/\[hora\]/gi, data.time || '')
      .replace(/\[valor\]/gi, data.price ? `R$ ${data.price.toFixed(2).replace('.', ',')}` : '')
      .replace(/\[endereço\]/gi, data.address || '');
  },

  /* Gera mensagem completa a partir de template + dados do agendamento */
  buildMessage(templateId, appointment) {
    const template = Store.getTemplate(templateId);
    if (!template) return '';

    const profile = Store.getProfile();

    return this.fillTemplate(template.text, {
      clientName: appointment.clientName,
      serviceName: appointment.serviceName || '',
      dateFormatted: DateUtils.formatDateFull(appointment.date),
      time: appointment.time,
      price: appointment.servicePrice || 0,
      address: profile.address || ''
    });
  },

  /* Abre WhatsApp com mensagem */
  send(phone, templateId, appointment) {
    const message = this.buildMessage(templateId, appointment);
    const link = this.generateLink(phone, message);
    window.open(link, '_blank');
  }
};
