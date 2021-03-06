import { v4 as uuidv4 } from 'uuid';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
} from 'typeorm';

import Account from './Account';
import Event from './Event';

@Entity('Profile')
export default class Profile extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar')
  firstname: string;

  @Column('varchar')
  lastname: string;

  @Column('varchar', { nullable: true })
  phoneNumber: string;

  @Column('varchar', { nullable: true })
  city: string;

  @Column('varchar', { nullable: true })
  country: string;

  @Column('varchar', { nullable: true })
  imageUrl: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP(3)' })
  createdAt: Date;

  @Column('timestamp', {
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updatedAt: Date;

  @OneToOne(_type => Account, account => account.profile)
  account: Account;

  @OneToMany(_type => Event, event => event.profile)
  event: Event;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
