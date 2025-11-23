const code = (c: number) => String(c).padStart(4, '0');
let count = 0;

export const CODE_MESSAGE = {
  UNAUTHORIZED_PROCESS: {
    message: 'Processo não autorizado!',
    code: code(count++),
  },
  SOMETHING_WRONG_HAPPENED: {
    message:
      'Algo de errado aconteceu. Verifique sua internet e tente novamente!',
    code: code(count++),
  },
};
