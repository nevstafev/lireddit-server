import { Post } from './entities/Post';
import { __propd__ } from './constants';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/User';

export default {
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: 'lireddit',
  type: 'postgresql',
  debug: !__propd__,
  user: 'postgres',
  password: 'postgres',
} as Parameters<typeof MikroORM.init>[0];
