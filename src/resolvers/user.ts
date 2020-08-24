import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from 'type-graphql';
import { MyContext } from 'src/types/MyContext';
import { User } from '../entities/User';
import argon2 from 'argon2';

@InputType()
class UserNamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResonse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResonse)
  async register(
    @Arg('options') options: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResonse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: 'username',
            message: "username can't be less than 3 symbols",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: 'password',
            message: "length can't be less than 4 symbols",
          },
        ],
      };
    }
    const existedUser = await em.findOne(User, { username: options.username });
    if (existedUser) {
      return {
        errors: [
          {
            field: 'username',
            message: 'User already exists',
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return { user };
  }

  @Mutation(() => UserResonse, { nullable: true })
  async login(
    @Arg('options') options: UserNamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResonse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: `User with name ${options.username} doesn't exist.`,
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }
    return { user };
  }
}
