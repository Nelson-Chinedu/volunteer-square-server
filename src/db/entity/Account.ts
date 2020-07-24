import { v4 as uuidv4 } from 'uuid';
import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn
} from 'typeorm';

import Profile from './Profile';

@Entity('Account')
export default class Account extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true})
  email: string;

  @Column('varchar', { length: 255})
  password: string;

  @Column('varchar', { default: false, length: 10 })
  blocked: boolean;

  @Column('varchar', { default: false, length: 10 })
  verified: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP(3)' })
  createdAt: Date;

  @Column('timestamp', { precision: 3, default: () => 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)'})
  updatedAt: Date;

  @OneToOne(_type => Profile, profile => profile.account, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  profile: Profile;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}