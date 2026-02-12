const ns = "stars.";

export const state = {
  read<T>(key: string) {
    try {
      let value = localStorage.getItem(`${ns}${key}`);

      return value === null ? null : (JSON.parse(value) as T);
    } catch {
      return null;
    }
  },
  write<T>(key: string, value: T) {
    try {
      localStorage.setItem(`${ns}${key}`, JSON.stringify(value));
    } catch {}
  },
};
