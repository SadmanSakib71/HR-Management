export interface Attendance extends Record<string, unknown> {
  id: number;
  employee_id: number;
  date: Date;
  // TIME columns are returned by node-postgres as plain strings (e.g. "09:12:00"),
  // not Date objects — there's no default type parser for the `time` OID.
  check_in_time: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAttendanceBody {
  employee_id: number;
  date: string;
  check_in_time: string;
}

export interface UpdateAttendanceBody {
  date?: string;
  check_in_time?: string;
}

export interface AttendanceListQuery {
  employee_id?: number;
  date?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceListResponse {
  data: Attendance[];
  total: number;
  page: number;
  limit: number;
}

// Not part of the public API surface: lets the service tell the controller
// whether createOrUpsertAttendance inserted a new row (201) or updated an
// existing one (200), without resorting to an `any`-typed tuple/object.
export interface AttendanceUpsertResult {
  record: Attendance;
  created: boolean;
}
