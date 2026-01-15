// Polyfill for localStorage in Node.js environment (SSR)
if (typeof window === 'undefined') {
  const mockStorage = new Map<string, string>();

  global.localStorage = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      mockStorage.set(key, value);
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
      delete (global as any).localStorage;
    },
  };
}

export {};
