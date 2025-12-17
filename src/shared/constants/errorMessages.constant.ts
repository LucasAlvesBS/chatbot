const code = (c: number) => String(c).padStart(4, '0');
let count = 0;

export const CODE_MESSAGE = {
  UNAUTHORIZED_PROCESS: {
    message: 'Unauthorized process!',
    code: code(count++),
  },
  SOMETHING_WRONG_HAPPENED: {
    message:
      'Something went wrong. Check your internet connection and try again!',
    code: code(count++),
  },
  EVENT_ALREADY_EXISTS: {
    message: 'Event already exists!',
    code: code(count++),
  },
};
