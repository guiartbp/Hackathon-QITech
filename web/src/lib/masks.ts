export function mascaraCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

export function mascaraCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18);
}

export function mascaraTelefone(value: string): string {
  let limpo = value.replace(/\D/g, '');
  if (limpo.length <= 11) {
    limpo = limpo.replace(/^(\d{2})(\d)/g, '($1) $2');
    limpo = limpo.replace(/(\d)(\d{4})$/, '$1-$2');
  }
  return limpo;
}