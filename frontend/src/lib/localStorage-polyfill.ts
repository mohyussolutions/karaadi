// Polyfill for localStorage in Node.js environment (SSR)
if (typeof window === "undefined") {
  const existing = (global as any).localStorage;

  const needsPolyfill = !existing || typeof existing.getItem !== "function";

  if (needsPolyfill) {
    const mockStorage = new Map<string, string>();

    const storage = {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        mockStorage.set(key, String(value));
      },
      removeItem: (key: string) => {
        mockStorage.delete(key);
      },
      clear: () => mockStorage.clear(),
      get length() {
        return mockStorage.size;
      },
      key: (index: number) => {
        const keys = Array.from(mockStorage.keys());
        return keys[index] ?? null;
      },
      destroy: () => {
        mockStorage.clear();
        try {
          delete (global as any).localStorage;
        } catch (e) {
          /* ignore */
        }
      },
    } as any;

    try {
      Object.defineProperty(global, "localStorage", {
        value: storage,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {
      // fallback assignment if defineProperty isn't allowed
      (global as any).localStorage = storage;
    }
  }
}

export {};
