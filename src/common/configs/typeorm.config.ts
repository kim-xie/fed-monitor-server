import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configs: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '49.234.134.123',
  port: 3306,
  username: 'root',
  password: 'P@ssw0rd',
  database: 'test',
  autoLoadEntities: true,
  synchronize: true,
  logger: 'file',
  logging: 'all',
};

export default configs;
