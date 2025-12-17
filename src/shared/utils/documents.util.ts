export function normalizeCPF(message: string): string {
  return message?.replace(/\D/g, '') ?? '';
}

export function checkIfItIsValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }

  let firstDigit = 11 - (sum % 11);
  if (firstDigit > 9) firstDigit = 0;
  if (Number(cpf[9]) !== firstDigit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }

  let secondDigit = 11 - (sum % 11);
  if (secondDigit > 9) secondDigit = 0;

  return Number(cpf[10]) === secondDigit;
}
