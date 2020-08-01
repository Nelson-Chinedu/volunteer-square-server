import { v4 as uuidv4 } from 'uuid';
import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BeforeInsert
} from 'typeorm';

import Profile from './Profile';
import Contact from './Contact';

@Entity('Event')
export default class Event extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  eventName: string;

  @Column('text')
  eventDescription: string;

  @Column('varchar', { length: 50 })
  category: string;

  @Column('varchar', { length: 50 })
  location: string;

  @Column('varchar', {  length: 100 })
  time: string;

  @Column('varchar',{ length: 100 })
  date: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP(3)' })
  createdAt: Date;

  @Column('timestamp', { precision: 3, default: () => 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)'})
  updatedAt: Date;

  @ManyToOne(_type => Profile, profile => profile.event, {
    onDelete: 'CASCADE',
    eager: true
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(_type => Contact, contact => contact.event)
  contact: Contact;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
