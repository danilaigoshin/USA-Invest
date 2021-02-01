export const status = (role: string) => {
  if (role === 'User') {
    return 'Базовый';
  }

  if (role === 'UserWithSub') {
    return 'PRO';
  }

  if (role === 'Admin') {
    return 'Админ';
  }
};
