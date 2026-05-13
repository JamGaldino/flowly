# Flowly — Gestão Inteligente para Profissionais Autônomas

O Flowly é uma Progressive Web App (PWA) de luxo projetada para simplificar a rotina de profissionais que dependem de agendamentos. Com uma interface premium e intuitiva, o sistema permite gerenciar clientes, serviços e enviar lembretes automáticos via WhatsApp.

## Funcionalidades Principais

- **Agenda Inteligente:** Visão diária e semanal com seletor de dias em estilo "pílula".
- **Indicadores de Status:** Sistema de cores (Azul para Confirmado, Amarelo para Aguardando, etc.) para visualização rápida.
- **Múltiplos Serviços:** Adicione vários serviços em um único agendamento.
- **Biblioteca de Mensagens:** Crie modelos de WhatsApp personalizados com variáveis automáticas como [nome], [hora] e [endereço].
- **PWA Ready:** Instale no seu celular como um aplicativo nativo (funciona offline).

## Como rodar o projeto localmente

Como o Flowly é construído com tecnologias web puras, você não precisa instalar dependências complexas (como npm ou node) para o uso básico.

### 1. Clonar o repositório
```bash
git clone https://github.com/JamGaldino/flowly.git
cd flowly
```

### 2. Abrir o projeto
Existem duas formas de visualizar o aplicativo:

#### Opção A: Servidor Local (Recomendado)
Para que todas as funções de PWA (Service Worker e Manifesto) funcionem perfeitamente, é recomendado usar um servidor local.
- Se você usa VS Code, instale a extensão Live Server.
- Clique com o botão direito no arquivo index.html e selecione "Open with Live Server".

#### Opção B: Direto no Navegador
- Basta localizar o arquivo index.html na pasta do projeto e dar um clique duplo para abrir no seu navegador preferido.

## Tecnologias Utilizadas

- **HTML5:** Estrutura semântica.
- **CSS3:** Design premium com variáveis e animações modernas.
- **Vanilla JavaScript:** Lógica de estado e renderização sem frameworks.
- **LocalStorage:** Persistência de dados local no navegador (privacidade total).
- **Service Workers:** Para suporte offline e instalação como PWA.

---
Feito por [Jam Galdino](https://github.com/JamGaldino)
