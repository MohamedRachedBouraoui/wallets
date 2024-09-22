import moment from "moment";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Params {


    @PrimaryColumn()
    id: number;

    @Column()
    premiereDate: Date;

    
    constructor(premiereDate:Date) {
        this.premiereDate=premiereDate;
    }
}