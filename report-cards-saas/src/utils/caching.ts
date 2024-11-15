export class CacheManager {
    private static cache = new Map<string, { data: any; timestamp: number }>();
    private static TTL = 5 * 60 * 1000; // 5 minutes default TTL
  
    static set(key: string, data: any, ttl: number = this.TTL): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now() + ttl
      });
    }
  
    static get(key: string): any | null {
      const item = this.cache.get(key);
      if (!item) return null;
      if (Date.now() > item.timestamp) {
        this.cache.delete(key);
        return null;
      }
      return item.data;
    }
  
    static invalidate(key: string): void {
      this.cache.delete(key);
    }
  }