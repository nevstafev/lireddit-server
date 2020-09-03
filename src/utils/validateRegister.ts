import { UsernamePasswordInput } from 'src/resolvers/UsernamePasswordInput';
export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: "username can't be less than 3 symbols",
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include @ sign',
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: 'password',
        message: "length can't be less than 3 symbols",
      },
    ];
  }
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  return null;
};
