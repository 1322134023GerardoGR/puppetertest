import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';
import { PokemonEntity } from "./entity/pokemon.entity";
@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(PokemonEntity)
    private readonly pokemonRepository: Repository<PokemonEntity>,
  ) {}

  async scrapeWebsite(url: string): Promise<PokemonEntity[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(url);
      const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
          const columns = row.querySelectorAll('td');
          return {
            number: columns[0]?.textContent?.trim(),
            name: columns[1]?.textContent?.trim(),
            type1: columns[2]?.textContent?.trim(),
            type2: columns[3]?.textContent?.trim() || null,
          };
        });
      });

      const entities = data.map(item => {
        const entity = new PokemonEntity();
        entity.number = item.number;
        entity.name = item.name;
        entity.type1 = item.type1;
        entity.type2 = item.type2;
        return entity;
      });

      return this.pokemonRepository.save(entities);
    } catch (error) {
      console.error('Error scraping website:', error);
      throw new Error('Failed to scrape website');
    } finally {
      await browser.close();
    }
  }
}
