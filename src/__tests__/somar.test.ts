import { somar } from "../domain/somar";

test("soma dois números", () => {
  const resultado = somar(2, 3);
  expect(resultado).toBe(5);
});
