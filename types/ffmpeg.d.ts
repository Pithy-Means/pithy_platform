declare module '@ffmpeg/ffmpeg' {
  export function createFFmpeg(options?: {log?: boolean}): {
    load: () => Promise<void>;
    // FS: (method: string, ...args: string[]) => string;
    // FS: (method: string, path: string, data?: Uint8Array) => void;
    FS: (method: 'writeFile' | 'readFile', path: string, data?: Uint8Array) => Uint8Array | void;
    run: (...args: string[]) => Promise<void>;
  };
  export function fetchFile(file: string | File): Promise<Uint8Array>;
}
