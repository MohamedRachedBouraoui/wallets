import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonsModule } from './commons/commons.module';
import { BaseDonneesModule } from './database/baseDonnees.module';
import config from './database/ormConfig';
import Categorie from './entities/categorie';
import Compte from './entities/compte';
import Params from './entities/params';
import Transfert from './entities/transfert';
import Trx from './entities/trx';
import { ParseurWebService } from './parseur-web.service';

@Module({
  imports: [CommonsModule
    , BaseDonneesModule
    , TypeOrmModule.forRoot(config)
    , TypeOrmModule.forFeature([Trx, Categorie, Params,Compte,Transfert])],
  controllers: [AppController],
  providers: [AppService, ParseurWebService],
})
export class AppModule { }
