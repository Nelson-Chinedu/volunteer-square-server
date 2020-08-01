import { v4 as uuidv4 } from 'uuid';
import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  JoinColumn,
  ManyToOne,
  BeforeInsert
} from 'typeorm';

import Event from './Event';

@Entity('Contact')
export default class Contact extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('varchar', { length: 30 })
  telephone: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP(3)' })
  createdAt: Date;

  @Column('timestamp', { precision: 3, default: () => 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)'})
  updatedAt: Date;

  @ManyToOne(_type => Event, event => event.contact, {
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn()
  event: Event;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
