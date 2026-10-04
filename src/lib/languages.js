// Target languages. `deepl` is the code DeepL expects.
export const LANGUAGES = [
  { code: "id", name: "Indonesian", deepl: "ID" },
  { code: "en", name: "English", deepl: "EN-US" },
  { code: "ja", name: "Japanese", deepl: "JA" },
  { code: "ko", name: "Korean", deepl: "KO" },
  { code: "zh", name: "Chinese (Simplified)", deepl: "ZH" },
  { code: "ar", name: "Arabic", deepl: "AR" },
  { code: "es", name: "Spanish", deepl: "ES" },
  { code: "fr", name: "French", deepl: "FR" },
  { code: "de", name: "German", deepl: "DE" },
  { code: "pt", name: "Portuguese (Brazil)", deepl: "PT-BR" },
  { code: "ru", name: "Russian", deepl: "RU" },
  { code: "it", name: "Italian", deepl: "IT" },
  { code: "nl", name: "Dutch", deepl: "NL" },
  { code: "tr", name: "Turkish", deepl: "TR" },
  { code: "pl", name: "Polish", deepl: "PL" },
  { code: "uk", name: "Ukrainian", deepl: "UK" }
];

export const langByCode = (code) =>
  LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
