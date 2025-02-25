/**
 * # Redis
 *
 * Connection holder with Redis.
 *
 * Configuration injected from `src/config/config.default`.
 *
 * @module
 */
import {
  Config,
  ContainerClassScope,
  Init,
  Provide,
  Scope
} from '../util/container';
import IoRedis, { Redis as Client, RedisOptions } from 'ioredis';

@Provide()
@Scope(ContainerClassScope.Singleton)
export class Redis {
  private client: Client;

  @Config('redis')
  config: RedisOptions;

  @Init()
  init() {
    this.client = new IoRedis(this.config);
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, ttl: number) {
    return this.client.setex(key, ttl, value);
  }

  increx(key: string, ttl: number) {
    const promise = this.client.incr(key);
    this.client.expire(key, ttl);
    return promise;
  }

  unset(key: string) {
    return this.client.del(key);
  }

  close() {
    this.client.disconnect();
  }
}
