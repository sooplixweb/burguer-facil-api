import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const parseConnectionString = (connectionString?: string) => {
  if (!connectionString) {
    return null;
  }

  try {
    const parsedUrl = new URL(connectionString);
    const sslMode = parsedUrl.searchParams.get('sslmode');

    return {
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port || 5432),
      username: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace(/^\/+/, ''),
      ssl:
        sslMode === 'require' ||
        sslMode === 'verify-ca' ||
        sslMode === 'verify-full',
    };
  } catch {
    return null;
  }
};

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const connectionString =
    configService.get<string>('DATABASE_URL') ??
    configService.get<string>('DB_URL');
  const parsedConnection = parseConnectionString(connectionString);

  const sslEnabled =
    configService.get<string>('DB_SSL') === 'true' ||
    parsedConnection?.ssl === true;

  return {
    type: 'postgres',
    host: parsedConnection?.host ?? configService.get<string>('DB_HOST'),
    port: parsedConnection?.port ?? Number(configService.get('DB_PORT') ?? 5432),
    username:
      parsedConnection?.username ?? configService.get<string>('DB_USERNAME'),
    password:
      parsedConnection?.password ?? configService.get<string>('DB_PASSWORD'),
    database:
      parsedConnection?.database ?? configService.get<string>('DB_DATABASE'),
    schema: configService.get<string>('DB_SCHEMA') ?? 'public',

    ssl: sslEnabled ? { rejectUnauthorized: false } : false,

    autoLoadEntities: true,
    synchronize: true,
  };
};
