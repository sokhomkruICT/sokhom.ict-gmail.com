import React, { useState } from 'react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  Subject,
  AdminNotice,
  LeaveRequest,
  SchoolInfo,
  Language,
} from '../types';
import { translations } from '../locales/translations';
import {
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Award,
  AlertTriangle,
  Clock,
  Phone,
  Send,
  FileText,
  UserCheck,
} from 'lucide-react';

interface ParentPortalViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  subjects: Subject[];
  notices: AdminNotice[];
  leaveRequests: LeaveRequest[];
  onSubmitLeaveRequest: (req: LeaveRequest) => void;
  onOpenReportCard: (student: Student) => void;
  schoolInfo: SchoolInfo;
  language: Language;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  attendance,
  grades,
  subjects,
  notices,
  leaveRequests,
  onSubmitLeaveRequest,
  onOpenReportCard,
  schoolInfo,
  language,
}) => {
  const t = translations[language];
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [leaveFrom, setLeaveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [leaveTo, setLeaveTo] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmittedSuccess, setLeaveSubmittedSuccess] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Attendance for student
  const studentAttendance = attendance.filter((a) => a.studentId === currentStudent?.id);
  const todayRecord = studentAttendance.find((a) => a.date === '2026-10-18');

  // Grades for student
  const studentGrades = grades.filter((g) => g.studentId === currentStudent?.id);

  // Leave requests for student
  const myLeaves = leaveRequests.filter((r) => r.studentId === currentStudent?.id);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !currentStudent) return;

    const newRequest: LeaveRequest = {
      id: `lr-${Date.now()}`,
      studentId: currentStudent.id,
      fromDate: leaveFrom,
      toDate: leaveTo,
      reason: leaveReason,
      status: 'pending',
      submittedBy: `${currentStudent.guardianNameKh} (${currentStudent.guardianRelationshipKh})`,
      parentPhone: currentStudent.guardianPhone,
      submitDate: new Date().toISOString().split('T')[0],
    };

    onSubmitLeaveRequest(newRequest);
    setLeaveReason('');
    setLeaveSubmittedSuccess(true);
    setTimeout(() => setLeaveSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card with Child Selector */}
      <div className="bg-linear-to-r from-teal-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
              <HeartHandshake className="w-9 h-9 text-teal-300" />
            </div>
            <div>
              <span className="text-xs text-teal-200 font-bold uppercase tracking-wider">
                {language === 'km' ? 'ទំព័រមាតាបិតា និងអាណាព្យាបាលសិស្ស' : 'Parent & Guardian Portal'}
              </span>
              <h2 className="text-2xl font-black mt-0.5">
                {language === 'km' ? 'សូមស្វាគមន៍មកកាន់សាលាឌីជីថល' : 'Welcome to Digital School Portal'}
              </h2>
            </div>
          </div>

          {/* Child Switcher */}
          <div className="bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <label className="block text-[11px] text-teal-200 font-semibold mb-1">
              {language === 'km' ? 'ជ្រើសរើសកូនរបស់អ្នក' : 'Select Your Child'}
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-xl focus:outline-hidden cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameKh} ({s.nameEn}) - ថ្នាក់ {s.grade}{s.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Child Details Banner */}
        {currentStudent && (
          <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.nameEn}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
              />
              <div>
                <h3 className="text-xl font-bold">{currentStudent.nameKh}</h3>
                <p className="text-xs text-teal-200">
                  {currentStudent.nameEn} • អត្តលេខ៖ <span className="font-mono">{currentStudent.code}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20">
                    ថ្នាក់ទី {currentStudent.grade}{currentStudent.section}
                  </span>
                  <span className="text-xs text-teal-200">
                    អាណាព្យាបាល៖ {currentStudent.guardianNameKh} ({currentStudent.guardianRelationshipKh})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenReportCard(currentStudent)}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>{t.printReportCard}</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid: Real-time Attendance & Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Attendance & Grades */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Attendance Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              {language === 'km' ? 'វត្តមានរបស់កូននៅថ្ងៃនេះ (Today)' : "Today's Attendance Status"}
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">កាលបរិច្ឆេទ</span>
                <span className="font-bold text-slate-800 text-sm">ថ្ងៃនេះ (2026-10-18)</span>
              </div>
              <div>
                <span
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    todayRecord?.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : todayRecord?.status === 'absent_excused'
                      ? 'bg-amber-100 text-amber-800'
                      : todayRecord?.status === 'absent_unexcused'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {todayRecord?.status === 'present'
                    ? '✓ វត្តមានក្នុងថ្នាក់ (Present)'
                    : todayRecord?.status === 'absent_excused'
                    ? 'មានច្បាប់សម្រាក (Excused)'
                    : todayRecord?.status === 'absent_unexcused'
                    ? 'អវត្តមានឥតច្បាប់ (Unexcused)'
                    : 'យឺត (Late)'}
                </span>
              </div>
            </div>
            {todayRecord?.remark && (
              <p className="text-xs text-slate-500 mt-2 italic">
                សម្គាល់របស់គ្រូ៖ "{todayRecord.remark}"
              </p>
            )}
          </div>

          {/* Recent Grades Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                {language === 'km' ? 'លទ្ធផលពិន្ទុមុខវិជ្ជាចុងក្រោយ' : 'Latest Subject Grades'}
              </h3>
              <span className="text-xs text-slate-400">ឆមាសទី១</span>
            </div>

            <div className="divide-y divide-slate-100">
              {studentGrades.map((g) => {
                const sub = subjects.find((s) => s.id === g.subjectId);
                return (
                  <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {sub ? sub.nameKh : g.subjectId} ({sub?.nameEn})
                      </span>
                      <span className="text-slate-400 text-[11px]">{g.comment || 'ការខិតខំល្អ'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {g.score} <span className="text-xs text-slate-400 font-normal">/100</span>
                      </span>
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          g.letterGrade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.letterGrade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {g.letterGrade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Submit Leave Request (លិខិតសុំច្បាប់) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                {language === 'km' ? 'ផ្ញើពាក្យសុំច្បាប់សម្រាកសិក្សា' : 'Submit Leave Request'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'km'
                  ? 'មាតាបិតាអាចសុំច្បាប់សម្រាកឱ្យកូនតាមប្រព័ន្ធនេះ ដោយមិនបាច់មកសាលាផ្ទាល់'
                  : 'Submit excused absence notices directly to teachers online'}
              </p>
            </div>

            {leaveSubmittedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'km' ? 'ពាក្យសុំច្បាប់ត្រូវបានបញ្ជូនទៅគ្រូបន្ទុកថ្នាក់រួចរាល់!' : 'Leave request submitted successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ចាប់ពីថ្ងៃ</label>
                  <input
                    type="date"
                    required
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ដល់ថ្ងៃ</label>
                  <input
                    type="date"
                    required
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  មូលហេតុនៃការសុំច្បាប់ (Reason)
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="ឧ. សិស្សមានជំងឺផ្តាសាយ ត្រូវការសម្រាកព្យាបាលនៅផ្ទះ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'km' ? 'បញ្ជូនពាក្យសុំច្បាប់' : 'Submit Leave Request'}</span>
              </button>
            </form>

            {/* My Leave Requests History */}
            {myLeaves.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  {language === 'km' ? 'ប្រវត្តិនៃការសុំច្បាប់កន្លងមក៖' : 'Past Leave Requests:'}
                </span>
                <div className="space-y-2">
                  {myLeaves.map((l) => (
                    <div key={l.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
                      <div className="flex justify-between font-medium">
                        <span>{l.fromDate} ដល់ {l.toDate}</span>
                        <span
                          className={`font-bold ${
                            l.status === 'approved'
                              ? 'text-emerald-600'
                              : l.status === 'rejected'
                              ? 'text-rose-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {l.status === 'approved' ? '✓ បានយល់ព្រម' : l.status === 'rejected' ? '✗ បដិសេធ' : '● កំពុងពិនិត្យ'}
                        </span>
                      </div>
                      <p className="text-slate-500 truncate mt-0.5">{l.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
