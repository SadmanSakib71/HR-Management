export interface AttendanceReportQuery {
  month: string;
  employee_id?: number;
}

export interface EmployeeAttendanceSummary {
  employee_id: number;
  name: string;
  days_present: number;
  times_late: number;
}

export interface AttendanceReportResponse {
  month: string;
  data: EmployeeAttendanceSummary[];
}
