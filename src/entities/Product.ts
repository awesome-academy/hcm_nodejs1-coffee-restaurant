import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { Common } from './Common';
import { InvoiceDetail } from './InvoiceDetail';
import { Type } from './Type';
import { Rating } from './Rating';
import { ProductInstance } from './ProductInstance';

@Entity()
export class Product extends Common {
  @Column()
  @Index({ fulltext: true, parser: 'ngram' })
  name: string;

  @Column()
  price: number;

  @Column()
  @Index({ fulltext: true, parser: 'ngram' })
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'float',
    default: 0,
  })
  rating_avg: number;

  @Column({
    default: 0,
  })
  rating_overall: number;

  @Column({
    default: true,
  })
  isActive: boolean;

  // FOREIGN KEY
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(() => Type, (type: Type) => type.products)
  type: Type;

  @ManyToOne(() => Rating, (rating: Rating) => rating.product)
  ratings: Rating[];

  @OneToMany(
    () => ProductInstance,
    (productInstance: ProductInstance) => productInstance.product,
  )
  productInstances: ProductInstance[];

  // METHOD
  url(): string {
    return `/products/${this.id}`;
  }
}
