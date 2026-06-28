import { neon } from '@neondatabase/serverless';
import { randomBytes, scryptSync } from 'node:crypto';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const sql = neon(databaseUrl);

function parseArgs(argv) {
  return Object.fromEntries(
    argv
      .filter((item) => item.startsWith('--'))
      .map((item) => {
        const [key, ...valueParts] = item.slice(2).split('=');
        return [key, valueParts.join('=') || 'true'];
      }),
  );
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function passwordFromArgs(args) {
  return args.password?.trim() || process.env.NEXORA_USER_PASSWORD?.trim() || '';
}

const args = parseArgs(process.argv.slice(2));
const action = args.action;
const username = args.username?.trim();

if (!['upsert', 'deactivate', 'activate', 'reset-password'].includes(action)) {
  throw new Error('Use --action=upsert, --action=deactivate, --action=activate, or --action=reset-password');
}

if (!username) {
  throw new Error('Missing required argument: --username=...');
}

if (action === 'upsert') {
  const displayName = args.displayName?.trim() || username;
  const password = passwordFromArgs(args);
  if (!password) throw new Error('Missing password. Use --password=... or NEXORA_USER_PASSWORD=...');
  const passwordHash = hashPassword(password);

  await sql`
    insert into users (username, display_name, password_hash, is_active)
    values (${username}, ${displayName}, ${passwordHash}, true)
    on conflict (username) do update set
      display_name = excluded.display_name,
      password_hash = excluded.password_hash,
      is_active = true,
      updated_at = now()
  `;

  console.log(`User upserted and activated: ${username}`);
}

if (action === 'deactivate') {
  await sql`
    update users
    set is_active = false, updated_at = now()
    where username = ${username}
  `;
  await sql`
    delete from sessions
    where user_id in (select id from users where username = ${username})
  `;

  console.log(`User deactivated and sessions cleared: ${username}`);
}

if (action === 'activate') {
  await sql`
    update users
    set is_active = true, updated_at = now()
    where username = ${username}
  `;

  console.log(`User activated: ${username}`);
}

if (action === 'reset-password') {
  const password = passwordFromArgs(args);
  if (!password) throw new Error('Missing password. Use --password=... or NEXORA_USER_PASSWORD=...');
  const passwordHash = hashPassword(password);

  await sql`
    update users
    set password_hash = ${passwordHash}, updated_at = now()
    where username = ${username}
  `;
  await sql`
    delete from sessions
    where user_id in (select id from users where username = ${username})
  `;

  console.log(`Password reset and sessions cleared: ${username}`);
}
