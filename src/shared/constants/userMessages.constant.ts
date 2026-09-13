export const WHATSAPP_MESSAGES = {
  welcome:
    'Olá! 👋\n\nSou o *Assistente Virtual* 🩺\nEstou aqui para lhe ajudar com seu atendimento.\n\nComo posso ajudar hoje?',
  flow: {
    scheduling: {
      monthSelection:
        'Perfeito! 😊\n\nVamos realizar o seu *agendamento de consulta médica*.\n\nPor favor, selecione o *mês*.',
      daySelection:
        'Certo! 🤗\n\nInforme o *dia* que funciona melhor para sua consulta.',
      hourSelection:
        'Quase lá! ⏰\n\nEscolha o *horário* que prefere para sua consulta.',
      scheduledEvent: ({
        day,
        month,
        year,
        hour,
        minute,
      }: {
        day: string;
        month: string;
        year: string;
        hour: string;
        minute: string;
      }) =>
        `Sua consulta foi agendada com sucesso ✅\n\n📅 *Data:* ${day}/${month}/${year}\n*Horário:* ${hour}h${minute}\n\nSe precisar remarcar ou cancelar, é só me avisar. 😊`,
      errors: {
        default:
          'Ops! Não consegui confirmar o seu agendamento agora 😕\n\nIsso pode acontecer por instabilidade momentânea.\n\n👉 Por favor, tente novamente em alguns instantes.',
        conflict:
          '⏳ Este horário acabou de ficar indisponível.\n\nIsso acontece quando outra consulta é agendada antes.',
      },
    },
    cancellation: {
      success:
        '*Consulta cancelada com sucesso!* ✅\n\nSe precisar realizar algum outro serviço, é só me avisar 😊',
      eventFound: ({
        day,
        month,
        year,
        hour,
        minute,
      }: {
        day: string;
        month: string;
        year: string;
        hour: string;
        minute: string;
      }) =>
        `Encontrei uma consulta marcada para você 📅\n\n*Data:* ${day}/${month}/${year}\n*Horário:* ${hour}h${minute}\n\nDeseja cancelar essa consulta?`,
      eventNotFound:
        'Não encontrei nenhuma consulta ativa para você no momento 😕\n\nSe precisar agendar uma nova consulta, é só me avisar.',
    },
    humanSupport: (phoneNumber: string) =>
      `👋 Um usuário pediu ajuda de um atendente humano.\n\n📞 *Contato:* ${phoneNumber}\n\nQuando possível, por favor, dê sequência ao atendimento 😊`,
  },
  alreadyHasActiveEvent: ({
    day,
    month,
    year,
    hour,
    minute,
  }: {
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
  }) =>
    `Verifiquei aqui e você já possui uma *consulta agendada* 📋\n\n*Data:* ${day}/${month}/${year}\n*Horário:* ${hour}h${minute}\n\nPara manter um melhor atendimento, é permitido apenas *uma consulta ativa por vez*.`,
  request: {
    documentNumber:
      'Agora informe o CPF 🪪\n\nDigite somente os números (sem pontos ou traços).\n\nExemplo: 00000000000',
    userName: 'Qual é o nome completo do paciente?',
  },
  invalid: {
    documentNumber:
      '❌ CPF inválido!\n\n👉 Envie apenas os *11 números do CPF*, sem pontos ou traços.\n\nExemplo: 00000000000',
  },
  errors: {
    default: 'Ops! Aconteceu algum problema 😕',
  },
} as const;
