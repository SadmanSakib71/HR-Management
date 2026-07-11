import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('attendance').del();
  await knex('employees').del();

  await knex('employees').insert([
    {
      name: 'Md. Rakibul Hasan',
      age: 29,
      designation: 'Software Engineer',
      hiring_date: '2021-06-01',
      date_of_birth: '1996-03-14',
      salary: 65000.0,
    },
    {
      name: 'Farhana Akter',
      age: 34,
      designation: 'HR Manager',
      hiring_date: '2018-01-15',
      date_of_birth: '1991-11-02',
      salary: 85000.0,
    },
    {
      name: 'Shakil Ahmed',
      age: 26,
      designation: 'Accountant',
      hiring_date: '2023-04-10',
      date_of_birth: '1999-08-22',
      salary: 45000.0,
    },
    {
      name: 'Nusrat Jahan',
      age: 31,
      designation: 'Sales Executive',
      hiring_date: '2020-09-01',
      date_of_birth: '1994-12-05',
      salary: 50000.0,
    },
    {
      name: 'Tanvir Islam',
      age: 23,
      designation: 'Office Assistant',
      hiring_date: '2024-03-01',
      date_of_birth: '2002-02-18',
      salary: 28000.0,
    },
  ]);
}
