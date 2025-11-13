// Symbol es una clase nativa de JS que permite crear identificadores únicos.
// Cada symbol se crea llamando a la función "Symbol()". Siempre cada symbol que generemos va a ser único.
// Opcionalmente, Symbol puede recibir un parámetro que es una "descripción". Solo sirve con fines depurativos.
// Funcionalmente, *no cambia nada*.
// Sirve para si uno imprime en la consola el Symbol, les muestre una descripción.
// export const globalFeedbackProviderKey = 'global-feedback';
export const globalFeedbackProviderKey = Symbol('Global Feedback Provider Key'); // 👈🏻 Noten que no hay un new.
