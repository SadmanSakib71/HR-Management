import bcrypt from 'bcrypt';
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('hr_users').del();

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex('hr_users').insert([
    {
      email: 'admin@hr.com',
      password_hash: passwordHash,
      name: 'HR Admin',
    },
  ]);
}
