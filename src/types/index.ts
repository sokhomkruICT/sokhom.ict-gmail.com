export type Language = 'km' | 'en';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface SchoolInfo {
  nameKh: string;
  nameEn: string;
  code: string;
  mottoKh: string;
  mottoEn: string;
  logoUrl: string;
  phone: string;
  email: string;
  website: string;
  addressKh: string;
  addressEn: string;
  academicYear: string;
  principalNameKh: string;
  principalNameEn: string;
  establishedYear: number;
  ministryAffiliationKh: string;
  ministryAffiliationEn: string;
}

export interface Teacher {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  subject: string;
  qualification: string;
  assignedClasses: string[];
  avatarUrl: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
}

export interface Student {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  gender: 'M' | 'F';
  dob: string;
  grade: string; // e.g., "10", "11", "12"
  section: string; // e.g., "A", "B"
  guardianNameKh: string;
  guardianNameEn: string;
  guardianPhone: string;
  guardianRelationshipKh: string;
  guardianRelationshipEn: string;
  address: string;
  avatarUrl: string;
  enrollmentDate: string;
  status: 'enrolled' | 'suspended' | 'graduated';
}

export interface Subject {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  coefficient: number; // មេគុណពិន្ទុ
  maxScore: number;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  month: string; // e.g. "តុលា", "វិច្ឆិកា", "October"
  semester: 'Semester 1' | 'Semester 2';
  score: number;
  letterGrade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  comment?: string;
  dateRecorded: string;
  teacherId?: string;
}

export type AttendanceStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remark?: string;
}

export interface ParentNotification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  type: 'attendance' | 'grade' | 'conduct' | 'event' | 'fee';
  date: string;
  status: 'sent' | 'pending' | 'read';
  channel: 'telegram' | 'sms' | 'portal';
}

export interface SchoolFile {
  id: string;
  title: string;
  titleKh?: string;
  category: 'curriculum' | 'exam' | 'circular' | 'form' | 'handbook';
  fileUrl: string;
  driveUrl?: string;
  uploadDate: string;
  fileSize: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP';
}

export interface AdminNotice {
  id: string;
  titleKh: string;
  titleEn: string;
  contentKh: string;
  contentEn: string;
  targetAudience: 'all' | 'teachers' | 'parents' | 'students';
  priority: 'normal' | 'important' | 'urgent';
  date: string;
  author: string;
}

export interface TuitionRecord {
  id: string;
  studentId: string;
  feeTitleKh: string;
  feeTitleEn: string;
  amount: number;
  currency: 'USD' | 'KHR';
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
}

export interface TimetableItem {
  id: string;
  grade: string;
  section: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "07:30 - 08:20"
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  parentPhone: string;
  submitDate: string;
  reviewedDate?: string;
}

export interface GoogleSheetsSyncConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  lastSyncedAt: string | null;
  autoSync: boolean;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}
