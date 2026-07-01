declare module 'node:fs' {
  export function readFileSync(path: URL | string, encoding: string): string;
}

declare module 'node:crypto' {
  export function createHash(algorithm: string): {
    update(data: string): {
      digest(encoding: 'hex'): string;
    };
  };
}
