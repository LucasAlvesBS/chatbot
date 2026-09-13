export const WHATSAPP_LISTS = {
  month: {
    buttonLabel: 'Selecionar mês',
    section: {
      title: 'Meses disponíveis',
      rows: [
        { id: 'month_01', title: 'Janeiro' },
        { id: 'month_02', title: 'Fevereiro' },
        { id: 'month_03', title: 'Março' },
        { id: 'month_04', title: 'Abril' },
        { id: 'month_05', title: 'Maio' },
        { id: 'month_06', title: 'Junho' },
        { id: 'month_07', title: 'Julho' },
        { id: 'month_08', title: 'Agosto' },
        { id: 'month_09', title: 'Setembro' },
        { id: 'month_10', title: 'Outubro' },
        { id: 'month_11', title: 'Novembro' },
        { id: 'month_12', title: 'Dezembro' },
      ],
    },
  },
  day: {
    buttonLabel: 'Selecionar dia',
    section: {
      title: 'Dias disponíveis',
      rowTemplate: {
        id: (day: string, month: string, year: string) =>
          `day_${day}_${month}_${year}`,
        title: (day: string, month: string, year: string) =>
          `${day}/${month}/${year}`,
      },
      defaultRows: {
        more: (month: string, year: string, page: number) => ({
          id: `day_more_${month}_${year}_p${page}`,
          title: 'Ver dias seguintes',
        }),
        previous: (month: string, year: string, page: number) => ({
          id: `day_prev_${month}_${year}_p${page}`,
          title: 'Ver dias anteriores',
        }),
        changeMonth: { id: 'day_month', title: 'Escolher outro mês' },
      },
    },
  },
  hour: {
    buttonLabel: 'Selecionar hora',
    section: {
      title: 'Horas disponíveis',
      rowTemplate: {
        id: (
          hour: string,
          minute: string,
          day: string,
          month: string,
          year: string,
        ) => `hour_${hour}_${minute}_${day}_${month}_${year}`,
        title: (hour: string, minute: string) => `${hour}:${minute}`,
      },
      defaultRows: {
        more: (day: string, month: string, year: string, page: number) => ({
          id: `hour_more_${day}_${month}_${year}_p${page}`,
          title: 'Ver horas seguintes',
        }),
        previous: (day: string, month: string, year: string, page: number) => ({
          id: `hour_prev_${day}_${month}_${year}_p${page}`,
          title: 'Ver horas anteriores',
        }),
        changeDay: (month: string, year: string) => ({
          id: `month_${month}_${year}`,
          title: 'Escolher outro dia',
        }),
      },
    },
  },
} as const;
