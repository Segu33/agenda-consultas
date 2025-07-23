const bcrypt = require('bcrypt');

(async () => {
  const passwordPlano = '1234'; // Podés cambiar esto por otra contraseña si querés
  const hash = await bcrypt.hash(passwordPlano, 10);
  console.log(`Hash para admin@clinica.com: ${hash}`);
})();
