const texts = {
  title: {
    en: "Album",
    ru: "Альбом",
  },
  list_nav_first_page: {
    en: "First page",
    ru: "На первую страницу",
  },
  list_nav_last_page: {
    en: "Last page",
    ru: "На последнюю страницу",
  },
  list_nav_prev_page: {
    en: "Previous page",
    ru: "На предыдущую страницу",
  },
  list_nav_next_page: {
    en: "Next page",
    ru: "На следующую страницу",
  },
  list_nav_home: {
    en: "Home",
    ru: "На главную",
  },
  standalone_nav_prev: {
    en: "Previous",
    ru: "Предыдущая",
  },
  standalone_nav_next: {
    en: "Next",
    ru: "Следующая",
  },
  standalone_nav_quit: {
    en: "To the list",
    ru: "К списку",
  },
  list_item_fullscreen: {
    en: "На весь экран",
    ru: "Full screen",
  },
} as const;

let langs = new Set(["en", "ru"]);

export function lang() {
  let lang = navigator.language.split("-")[0];
  return langs.has(lang) ? lang : "en";
}

export function i18n(key: keyof typeof texts) {
  // @ts-expect-error
  return texts[key]?.[lang()] ?? texts[key]?.en ?? key;
}
