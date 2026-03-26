import { Redis } from "@upstash/redis";
import { getServerConfig } from "@/lib/server/config";

export interface SecurityStore {
  get(key: string): Promise<unknown | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string, ttlSeconds: number): Promise<number>;
}

type MemoryRecord = {
  value: string;
  expiresAt: number;
};

class MemorySecurityStore implements SecurityStore {
  private records = new Map<string, MemoryRecord>();

  private cleanup(key: string) {
    const record = this.records.get(key);
    if (!record) {
      return null;
    }

    if (record.expiresAt <= Date.now()) {
      this.records.delete(key);
      return null;
    }

    return record;
  }

  async get(key: string) {
    return this.cleanup(key)?.value ?? null;
  }

  async set(key: string, value: string, ttlSeconds: number) {
    this.records.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string) {
    this.records.delete(key);
  }

  async incr(key: string, ttlSeconds: number) {
    const record = this.cleanup(key);
    const current = record ? Number(record.value) : 0;
    const next = current + 1;
    await this.set(key, String(next), ttlSeconds);
    return next;
  }
}

class UpstashSecurityStore implements SecurityStore {
  constructor(private readonly redis: Redis) {}

  async get(key: string) {
    const value = await this.redis.get(key);
    return value ?? null;
  }

  async set(key: string, value: string, ttlSeconds: number) {
    await this.redis.set(key, value, { ex: ttlSeconds });
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async incr(key: string, ttlSeconds: number) {
    const next = await this.redis.incr(key);
    if (next === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return next;
  }
}

const globalStore = globalThis as typeof globalThis & {
  __pdaSecurityStore?: SecurityStore | null;
};

export function getSecurityStore(): SecurityStore | null {
  if (globalStore.__pdaSecurityStore !== undefined) {
    return globalStore.__pdaSecurityStore;
  }

  const config = getServerConfig();

  if (config.security.useMemoryStore) {
    globalStore.__pdaSecurityStore = new MemorySecurityStore();
    return globalStore.__pdaSecurityStore;
  }

  if (config.security.upstashUrl && config.security.upstashToken) {
    globalStore.__pdaSecurityStore = new UpstashSecurityStore(
      new Redis({
        url: config.security.upstashUrl,
        token: config.security.upstashToken,
      }),
    );
    return globalStore.__pdaSecurityStore;
  }

  globalStore.__pdaSecurityStore = null;
  return null;
}

export function resetSecurityStoreForTests() {
  globalStore.__pdaSecurityStore = undefined;
}
