import NodeCache from 'node-cache'
import nodeCache from 'node-cache'

export class CacheManager{
  private static instance = new nodeCache({ stdTTL: 0, checkperiod: 300 })
  
  public static get Instance() : NodeCache {
    return this.instance
  }
}