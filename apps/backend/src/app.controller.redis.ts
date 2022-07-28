import { Controller, Get, Res, HttpStatus } from '@nestjs/common';


import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';




@Controller('api/v1/redis')
export class AppControllerRedis {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    @Get('liquidityPairs')
    async test(@Res() response: any): Promise<string> {
        const value = await this.cacheManager.get('pairsWithLiquity');
        return response.status(HttpStatus.OK).json(value);
    }

}
