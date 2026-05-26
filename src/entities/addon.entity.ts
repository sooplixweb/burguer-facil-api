import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index } from "typeorm";
import { ProductEntity } from "./product-entity";

@Entity("addons")
export class AddonEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  price: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  // @ManyToMany(() => ProductEntity, (p) => p.addons)
  // products: ProductEntity[];
}
