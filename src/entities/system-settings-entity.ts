import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_settings')
export class SystemSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'time' })
  openingTime: string; // exemplo: "09:00"

  @Column({ type: 'time' })
  closingTime: string; // exemplo: "17:00"

  @Column({ type: 'varchar', length: 64, default: 'America/Sao_Paulo' })
  timezone: string;

  @Column({ type: 'boolean', default: true })
  ordersEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
