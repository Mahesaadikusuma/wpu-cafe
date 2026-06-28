// Cek apakah kode berjalan di server (Next.js/SSR) atau browser.
// Di server tidak ada `window`, jadi localStorage tidak tersedia → set null.
// Di browser, `window` ada → gunakan localStorage.
const storage = typeof window === 'undefined' ? null : localStorage;

// <T> adalah Generic — tipe T ditentukan saat fungsi dipanggil, bukan saat dibuat.
// key    : nama data yang ingin diambil
// fallback: nilai cadangan jika data tidak ditemukan atau gagal dibaca
// : T    : fungsi ini akan return nilai bertipe T (sama dengan fallback)
const getLocalStorage = <T>(key: string, fallback: T): T => {
  try {
    // Optional chaining (?.) — jika storage null (di server), langsung return undefined
    // tanpa throw error. Hasilnya: string | null | undefined
    const item = storage?.getItem(key);

    // Jika key tidak ditemukan di localStorage, getItem() return null
    // Kita kembalikan fallback sebagai gantinya
    if (item === null || item === undefined) return fallback;

    // JSON.parse mengubah string → nilai aslinya (object, number, boolean, dll)
    // `as T` memberitahu TypeScript bahwa hasil parse bertipe T
    return JSON.parse(item) as T;
  } catch {
    // JSON.parse bisa throw error jika string tidak valid JSON
    // Daripada crash, kembalikan fallback
    return fallback;
  }
};

// value: unknown — lebih aman dari `any`, memaksa kita handle tipe sebelum dipakai
// : void — fungsi ini tidak return nilai apapun
const setLocalStorage = (key: string, value: unknown): void => {
  try {
    // JSON.stringify mengubah nilai (object, number, dll) → string
    // karena localStorage hanya bisa menyimpan string
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    // Bisa throw jika: storage penuh, atau value tidak bisa di-stringify
    // (misal: object circular reference)
    console.warn(`[localStorage] Gagal menyimpan key "${key}"`);
  }
};

// Menghapus satu item dari localStorage berdasarkan key
// : void — tidak return nilai apapun
const removeLocalStorage = (key: string): void => {
  storage?.removeItem(key);
};

// Ekspor ketiga fungsi agar bisa dipakai di file lain
export { getLocalStorage, setLocalStorage, removeLocalStorage };