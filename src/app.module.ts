import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapingModule } from './scraping/scraping.module';
import { PokemonEntity } from "./scraping/entity/pokemon.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'wscrapping',
      entities: [PokemonEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([PokemonEntity]),
    ScrapingModule,
  ],
})
export class AppModule {}
