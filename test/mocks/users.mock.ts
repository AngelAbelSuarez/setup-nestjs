export const userData = {
  name: 'newuser',
  email: 'new@example.com',
  password: 'newpassword123',
  dragonBallZIds: [1, 2, 3],
};

export const userData2 = {
  name: 'newuser2',
  email: 'new2@example.com',
  password: 'newpassword123',
  dragonBallZIds: [2],
};

export const idUserNotFound = '17a6b856-03d8-44a5-a87f-cf76fcc67f45';

export const mockDragonBallZData = [
  {
    id: 1,
    name: 'Goku',
    ki: '1000',
    maxKi: '1000',
    race: 'Saiyan',
    gender: 'Male',
    description: 'The strongest being in the universe',
    image: 'https://example.com/goku.jpg',
    affiliation: 'Saiyan',
  },
  {
    id: 2,
    name: 'Vegeta',
    ki: '1000',
    maxKi: '1000',
    race: 'Saiyan',
    gender: 'Male',
    description: 'The strongest being in the universe',
    image: 'https://example.com/vegeta.jpg',
    affiliation: 'Saiyan',
  },
];

export const getDragonBallZIdFromUrl = (url: string): number | null => {
  for (const character of mockDragonBallZData) {
    if (url.includes(`/${character.id}`)) {
      return character.id;
    }
  }
  return null;
};
