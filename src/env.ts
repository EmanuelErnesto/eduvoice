

export const env = {
  API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
};

export const validateEnv = () => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Configuração inválida: A variável de ambiente '${key}' é obrigatória, mas não foi definida.`);
    }
  });
};
