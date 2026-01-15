type LocalStorageMock = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  destroy?(): void;
  readonly length: number;
  key(index: number): string | null;
};

declare global {
  namespace NodeJS {
    interface Global {
      localStorage: LocalStorageMock;
    }
  }
  var localStorage: LocalStorageMock;
}

export {};
