declare module 'node:fs' {
  export function existsSync(path: URL | string): boolean;
  export function readFileSync(path: URL | string, encoding: string): string;
  export function readdirSync(path: URL | string, options?: { recursive?: boolean }): string[];
  export function statSync(path: URL | string): { isFile(): boolean };
}

declare module 'node:crypto' {
  export function createHash(algorithm: string): {
    update(data: string): {
      digest(encoding: 'hex'): string;
    };
  };
}
