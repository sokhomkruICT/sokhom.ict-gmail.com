/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth } from './services/firebase';
import {
  SchoolInfo,
  Teacher,
  Student,
  Subject,
  GradeRecord,
  AttendanceRecord,
  ParentNotification,
  SchoolFile,
  AdminNotice,
  TuitionRecord,
  TimetableItem,
  LeaveRequest,
  Language,
  UserRole,
  GoogleSheetsSyncConfig,
} from './types';
import {
  initialSchoolInfo,
  initialTeachers,
  initialStudents,
  initialSubjects,
  initialGradeRecords,
  initialAttendanceRecords,
  initialParentNotifications,
  initialSchoolFiles,
  initialAdminNotices,
  initialTuitionRecords,
  initialTimetable,
  initialLeaveRequests,
} from './data/initialData';
import { translations } from './locales/translations';
import { Navbar } from './components/Navbar';
import { SchoolInfoTab } from './components/SchoolInfoTab';
import { TeacherManagementTab } from './components/TeacherManagementTab';
import { StudentManagementTab } from './components/StudentManagementTab';
import { GradesTab } from './components/GradesTab';
import { AttendanceTab } from './components/AttendanceTab';
import { ParentNotificationTab } from './components/ParentNotificationTab';
import { AdministrationTab } from './components/AdministrationTab';
import { FileRepositoryTab } from './components/FileRepositoryTab';
import { ParentPortalView } from './components/ParentPortalView';
import { StudentPortalView } from './components/StudentPortalView';
import { ReportCardModal } from './components/ReportCardModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  BellRing,
  FolderArchive,
  Briefcase,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('km');
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('school');

  // School Data States (Initialized with rich Cambodian school sample data)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem('kh_school_info');
    return saved ? JSON.parse(saved) : initialSchoolInfo;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('kh_school_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('kh_school_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [subjects] = useState<Subject[]>(initialSubjects);

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('kh_school_grades');
    return saved ? JSON.parse(saved) : initialGradeRecords;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('kh_school_attendance');
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [notifications, setNotifications] = useState<ParentNotification[]>(() => {
    const saved = localStorage.getItem('kh_school_notifications');
    return saved ? JSON.parse(saved) : initialParentNotifications;
  });

  const [files, setFiles] = useState<SchoolFile[]>(() => {
    const saved = localStorage.getItem('kh_school_files');
    return saved ? JSON.parse(saved) : initialSchoolFiles;
  });

  const [notices, setNotices] = useState<AdminNotice[]>(() => {
    const saved = localStorage.getItem('kh_school_notices');
    return saved ? JSON.parse(saved) : initialAdminNotices;
  });

  const [tuitions, setTuitions] = useState<TuitionRecord[]>(() => {
    const saved = localStorage.getItem('kh_school_tuitions');
    return saved ? JSON.parse(saved) : initialTuitionRecords;
  });

  const [timetable, setTimetable] = useState<TimetableItem[]>(() => {
    const saved = localStorage.getItem('kh_school_timetable');
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('kh_school_leaves');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  // Auth and Google Sheets sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncConfig, setSyncConfig] = useState<GoogleSheetsSyncConfig>(() => {
    const saved = localStorage.getItem('kh_school_sync_config');
    return saved
      ? JSON.parse(saved)
      : {
          spreadsheetId: null,
          spreadsheetUrl: null,
          lastSyncedAt: null,
          autoSync: false,
          status: 'idle',
        };
  });

  // Modals
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('kh_school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('kh_school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('kh_school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kh_school_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('kh_school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('kh_school_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kh_school_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('kh_school_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('kh_school_tuitions', JSON.stringify(tuitions));
  }, [tuitions]);

  useEffect(() => {
    localStorage.setItem('kh_school_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('kh_school_leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('kh_school_sync_config', JSON.stringify(syncConfig));
  }, [syncConfig]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const t = translations[language];

  // Tab definitions
  const adminTabs = [
    { id: 'school', label: t.tabSchoolInfo, icon: Building2 },
    { id: 'teachers', label: t.tabTeachers, icon: Users },
    { id: 'students', label: t.tabStudents, icon: GraduationCap },
    { id: 'grades', label: t.tabGrades, icon: Award },
    { id: 'attendance', label: t.tabAttendance, icon: CalendarCheck },
    { id: 'notifications', label: t.tabNotifications, icon: BellRing },
    { id: 'admin', label: t.tabAdministration, icon: Briefcase },
    { id: 'files', label: t.tabFiles, icon: FolderArchive },
  ];

  const teacherTabs = [
    { id: 'grades', label: t.tabGrades, icon: Award },
    { id: 'attendance', label: t.tabAttendance, icon: CalendarCheck },
    { id: 'students', label: t.tabStudents, icon: GraduationCap },
    { id: 'notifications', label: t.tabNotifications, icon: BellRing },
    { id: 'admin', label: t.timetable, icon: Briefcase },
    { id: 'files', label: t.tabFiles, icon: FolderArchive },
  ];

  const currentTabs = activeRole === 'teacher' ? teacherTabs : adminTabs;

  // Make sure activeTab is valid when switching role
  useEffect(() => {
    if (activeRole === 'teacher' && activeTab === 'school') {
      setActiveTab('grades');
    }
  }, [activeRole, activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        schoolInfo={schoolInfo}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        syncConfig={syncConfig}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* If Active Role is Parent: show specialized friendly Parent Portal */}
        {activeRole === 'parent' ? (
          <ParentPortalView
            students={students}
            attendance={attendance}
            grades={grades}
            subjects={subjects}
            notices={notices}
            leaveRequests={leaveRequests}
            onSubmitLeaveRequest={(req) => setLeaveRequests([req, ...leaveRequests])}
            onOpenReportCard={(st) => setReportCardStudent(st)}
            schoolInfo={schoolInfo}
            language={language}
          />
        ) : activeRole === 'student' ? (
          /* If Active Role is Student: show specialized friendly Student Portal */
          <StudentPortalView
            students={students}
            timetable={timetable}
            grades={grades}
            subjects={subjects}
            teachers={teachers}
            files={files}
            onOpenReportCard={(st) => setReportCardStudent(st)}
            language={language}
          />
        ) : (
          /* Admin / Teacher View with Tabbed Navigation */
          <div className="space-y-6">
            {/* Horizontal Sub Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
              {currentTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {activeTab === 'school' && (
              <SchoolInfoTab
                schoolInfo={schoolInfo}
                onUpdateSchoolInfo={setSchoolInfo}
                totalStudents={students.length}
                totalTeachers={teachers.length}
                language={language}
              />
            )}

            {activeTab === 'teachers' && (
              <TeacherManagementTab
                teachers={teachers}
                onAddTeacher={(t) => setTeachers([t, ...teachers])}
                onUpdateTeacher={(upd) =>
                  setTeachers(teachers.map((t) => (t.id === upd.id ? upd : t)))
                }
                onDeleteTeacher={(id) => setTeachers(teachers.filter((t) => t.id !== id))}
                language={language}
              />
            )}

            {activeTab === 'students' && (
              <StudentManagementTab
                students={students}
                onAddStudent={(s) => setStudents([s, ...students])}
                onUpdateStudent={(upd) =>
                  setStudents(students.map((s) => (s.id === upd.id ? upd : s)))
                }
                onDeleteStudent={(id) => setStudents(students.filter((s) => s.id !== id))}
                onOpenReportCard={(st) => setReportCardStudent(st)}
                language={language}
              />
            )}

            {activeTab === 'grades' && (
              <GradesTab
                students={students}
                subjects={subjects}
                grades={grades}
                onSaveGrades={setGrades}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
                language={language}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceTab
                students={students}
                attendance={attendance}
                onSaveAttendance={setAttendance}
                onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
                language={language}
              />
            )}

            {activeTab === 'notifications' && (
              <ParentNotificationTab
                students={students}
                notifications={notifications}
                onAddNotification={(n) => setNotifications([n, ...notifications])}
                leaveRequests={leaveRequests}
                onUpdateLeaveRequest={(upd) =>
                  setLeaveRequests(leaveRequests.map((l) => (l.id === upd.id ? upd : l)))
                }
                language={language}
              />
            )}

            {activeTab === 'admin' && (
              <AdministrationTab
                notices={notices}
                onAddNotice={(n) => setNotices([n, ...notices])}
                timetable={timetable}
                onAddTimetableItem={(tt) => setTimetable([...timetable, tt])}
                tuitions={tuitions}
                onAddTuition={(tu) => setTuitions([tu, ...tuitions])}
                onUpdateTuition={(upd) =>
                  setTuitions(tuitions.map((t) => (t.id === upd.id ? upd : t)))
                }
                students={students}
                subjects={subjects}
                teachers={teachers}
                language={language}
              />
            )}

            {activeTab === 'files' && (
              <FileRepositoryTab
                files={files}
                onAddFile={(f) => setFiles([f, ...files])}
                language={language}
              />
            )}
          </div>
        )}
      </main>

      {/* Official Cambodian Printable Report Card Modal */}
      <ReportCardModal
        isOpen={Boolean(reportCardStudent)}
        onClose={() => setReportCardStudent(null)}
        student={reportCardStudent}
        schoolInfo={schoolInfo}
        subjects={subjects}
        grades={grades}
        attendance={attendance}
        allStudents={students}
        allGrades={grades}
        language={language}
      />

      {/* Google Sheets Integration & Synchronization Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        syncConfig={syncConfig}
        onUpdateSyncConfig={(upd) => setSyncConfig((prev) => ({ ...prev, ...upd }))}
        syncPayload={{
          schoolInfo,
          students,
          teachers,
          attendance,
          grades,
          subjects,
          tuitions,
        }}
        language={language}
      />

      {/* Footer */}
      <footer className="no-print mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{schoolInfo.nameKh}</span>
            <span>•</span>
            <span>{schoolInfo.ministryAffiliationKh}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 {schoolInfo.nameEn}. រក្សាសិទ្ធិគ្រប់យ៉ាង។</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Google Sheets OAuth Integrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
