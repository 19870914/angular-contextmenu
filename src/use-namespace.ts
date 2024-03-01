export interface IUseNamespace {
  b: (block?: string) => string;
}

function b(namespace: string, block?: string): string {
  let className = namespace;
  if (block) {
    className += `-${block}`;
  }
  return className;
}

export function useNamespace(namespace: string): IUseNamespace {
  return {
    b(block?: string): string {
      return b(namespace, block);
    }
  };
}

