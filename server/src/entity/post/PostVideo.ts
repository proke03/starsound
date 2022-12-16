import { Field, ObjectType } from 'type-graphql'
import { Embeddable, Embedded, Property } from '@mikro-orm/core'
import { File } from '@/entity'

@Embeddable()
@ObjectType()
export class PostVideo {
  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  videoUrl: string

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  linkUrl?: string

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  caption?: string
}
