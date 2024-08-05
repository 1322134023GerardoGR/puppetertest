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
    await page.goto(url);

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(row => {
        const columns = row.querySelectorAll('td');

        const number = columns[0]?.textContent?.trim();

        // Determinar si la segunda columna es la imagen o el nombre
        let name = null;
        let type1Element = null;
        let type2Element = null;

        if (columns[1]?.querySelector('a img')) {
          name = columns[2]?.querySelector('a')?.textContent?.trim();
          type1Element = columns[3]?.querySelectorAll('a')[1];
          type2Element = columns[4]?.querySelectorAll('a')[1];
        } else {
          name = columns[1]?.querySelector('a')?.textContent?.trim();
          type1Element = columns[2]?.querySelectorAll('a')[1];
          type2Element = columns[3]?.querySelectorAll('a')[1];
        }

        // Si no se encuentra el type1, asignar un valor predeterminado
        const type1 = type1Element ? type1Element.textContent?.trim() : 'Unknown';

        // Si no se encuentra el type2, dejarlo como null
        const type2 = type2Element ? type2Element.textContent?.trim() : null;

        return {
          number,
          name,
          type1,
          type2,
        };
      });
    });

    await browser.close();

    const entities = data.map(item => {
      const entity = new PokemonEntity();
      entity.number = item.number;
      entity.name = item.name;
      entity.type1 = item.type1;
      entity.type2 = item.type2;
      return entity;
    });

    return this.pokemonRepository.save(entities);
  }
}
