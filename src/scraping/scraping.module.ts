import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { PokemonEntity } from "./entity/pokemon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PokemonEntity])],
  providers: [ScrapingService],
  controllers: [ScrapingController],
})
export class ScrapingModule {}
