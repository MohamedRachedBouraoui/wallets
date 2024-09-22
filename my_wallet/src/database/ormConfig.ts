import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { SeederOptions } from 'typeorm-extension';


const config: SqliteConnectionOptions & SeederOptions= {
    type: "sqlite",
    database: 'db/my_wallet.db3',
    entities:['dist/entities/**/*.js'],
    synchronize:true,
    logging:true,
}

export default config;