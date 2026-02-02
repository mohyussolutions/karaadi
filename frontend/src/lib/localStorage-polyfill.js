// Polyfill for localStorage in Node.js environment (SSR)
if (typeof window === "undefined") {
  const existing = global.localStorage;
  const needsPolyfill = !existing || typeof existing.getItem !== "function";

  if (needsPolyfill) {
    const mockStorage = new Map();

    const storage = {
      getItem: (key) => (mockStorage.has(key) ? mockStorage.get(key) : null),
      setItem: (key, value) => mockStorage.set(key, String(value)),
      removeItem: (key) => mockStorage.delete(key),
      clear: () => mockStorage.clear(),
      get length() {
        return mockStorage.size;
      },
      key: (index) => {
        const keys = Array.from(mockStorage.keys());
        return keys[index] ?? null;
      },
      destroy: () => {
        mockStorage.clear();
        try {
          delete global.localStorage;
        } catch (e) {}
      },
    };

    try {
      Object.defineProperty(global, "localStorage", {
        value: storage,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } catch (e) {
      global.localStorage = storage;
    }
  }
}

export default {};
