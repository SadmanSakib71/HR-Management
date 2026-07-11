import type { Knex } from 'knex';

interface EmployeeRow {
  id: number;
  name: string;
}

export async function seed(knex: Knex): Promise<void> {
  await knex('attendance').del();

  const employees: EmployeeRow[] = await knex('employees').select('id', 'name');

  const getId = (name: string): number => {
    const employee = employees.find((candidate) => candidate.name === name);
    if (!employee) {
      throw new Error(`Employee not found: ${name}. Run the employees seed first.`);
    }
    return employee.id;
  };

  const dateOffset = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };

  await knex('attendance').insert([
    { employee_id: getId('Md. Rakibul Hasan'), date: dateOffset(4), check_in_time: '09:12:00' },
    { employee_id: getId('Md. Rakibul Hasan'), date: dateOffset(3), check_in_time: '09:50:00' },
    { employee_id: getId('Md. Rakibul Hasan'), date: dateOffset(1), check_in_time: '09:05:00' },
    { employee_id: getId('Farhana Akter'), date: dateOffset(4), check_in_time: '09:30:00' },
    { employee_id: getId('Farhana Akter'), date: dateOffset(2), check_in_time: '10:05:00' },
    { employee_id: getId('Shakil Ahmed'), date: dateOffset(3), check_in_time: '09:40:00' },
    { employee_id: getId('Shakil Ahmed'), date: dateOffset(1), check_in_time: '10:15:00' },
    { employee_id: getId('Nusrat Jahan'), date: dateOffset(4), check_in_time: '08:55:00' },
    { employee_id: getId('Nusrat Jahan'), date: dateOffset(2), check_in_time: '09:47:00' },
    { employee_id: getId('Tanvir Islam'), date: dateOffset(3), check_in_time: '09:20:00' },
  ]);
}
