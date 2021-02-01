export const rankColor = (rank: number) => {
  let borderColor = '';
  if (rank < 3) {
    borderColor = 'rgb(255, 0, 0)';
  }

  if (rank === 3) {
    borderColor = 'rgb(248, 138, 69)';
  }

  if (rank === 4 || rank === 5) {
    borderColor = 'rgb(255, 221, 11)';
  }

  if (rank === 6 || rank === 7) {
    borderColor = 'rgb(170, 249, 2)';
  }

  if (rank > 7) {
    borderColor = 'rgb(0, 235, 0)';
  }

  return borderColor;
};

export const statusColor = (status: string) => {
  let borderColor = '';

  if (status === 'Сильно недооценена') {
    borderColor = 'rgb(0, 235, 0)';
  }

  if (status === 'Недооценена') {
    borderColor = 'rgb(147 255 138 / 65%)';
  }

  if (status === 'Справедливо оценена') {
    borderColor = 'rgb(255, 221, 11)';
  }

  if (status === 'Переоценена') {
    borderColor = 'rgb(253 53 53 / 65%)';
  }

  if (status === 'Сильно переоценена') {
    borderColor = 'rgb(255, 0, 0)';
  }

  return borderColor;
};
