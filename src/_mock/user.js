import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(10)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/icons8-microchip-96.png`,
  name: `ASM230100${index + 1}`,
  area: sample(['AREA 1','AREA 2']),
  ipDevice: sample(['192.168.100.101', '192.168.100.102']),
  status: sample(['online', 'offline']),
  role: sample([
    'NORMAL',
    'MODE 1',
    'MODE 2',
    'MODE 3',
    'MODE 4',
    'MODE 5',
    'MODE 6',
    'MODE 7',
    'MODE 8',
  ]),
}));

export default users;
