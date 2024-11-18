export class CacheManager {
  private static cache = new Map<string, any>();

  static get(key: string): any | undefined {
    return this.cache.get(key);
  }

  static set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  static clear(): void {
    this.cache.clear();
  }
}
