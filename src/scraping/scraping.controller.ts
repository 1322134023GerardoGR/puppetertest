import { Controller, Get, Query } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Get()
  async scrape(@Query('url') url: string) {
    const data = await this.scrapingService.scrapeWebsite(url);
    return data;
  }
}
