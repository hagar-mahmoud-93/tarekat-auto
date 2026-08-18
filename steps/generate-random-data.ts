export function randomMobileNumber(): string {
  let digits = '';
  for (let i = 0; i < 7; i++) digits += Math.floor(Math.random() * 10);
  return `056${digits}`;
}
