import { Migration } from '@mikro-orm/migrations';

export class Migration20200824160406 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "user_name" to "username";');
  }

}
