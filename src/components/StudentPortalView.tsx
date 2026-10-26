import React, { useState } from 'react';
import {
  Student,
  TimetableItem,
  GradeRecord,
  Subject,
  SchoolFile,
  Teacher,
  Language,
} from '../types';
import { translations } from '../locales/translations';
import {
  BookOpen,
  CalendarDays,
  Award,
  Download,
  ExternalLink,
  GraduationCap,
  Clock,
} from 'lucide-react';

interface StudentPortalViewProps {
  students: Student[];
  timetable: TimetableItem[];
  grades: GradeRecord[];
  subjects: Subject[];
  teachers: Teacher[];
  files: SchoolFile[];
  onOpenReportCard: (student: Student) => void;
  language: Language;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  timetable,
  grades,
  subjects,
  teachers,
  files,
  onOpenReportCard,
  language,
}) => {
  const t = translations[language];
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentGrades = grades.filter((g) => g.studentId === currentStudent?.id);

  return (
    <div className="space-y-6">
      {/* Student Welcome Header */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
              <GraduationCap className="w-9 h-9 text-blue-300" />
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider">
                {language === 'km' ? 'ទំព័រសិស្សានុសិស្ស' : 'Student Portal'}
              </span>
              <h2 className="text-2xl font-black mt-0.5">
                {language === 'km' ? `សួស្តីប្អូន ${currentStudent?.nameKh}` : `Welcome, ${currentStudent?.nameEn}`}
              </h2>
              <p className="text-xs text-blue-200 mt-1">
                អត្តលេខ៖ {currentStudent?.code} • ថ្នាក់ទី {currentStudent?.grade}{currentStudent?.section}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-white/20 backdrop-blur-md text-white rounded-xl border border-white/30 cursor-pointer focus:outline-hidden"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-900">
                  {s.nameKh} ({s.code})
                </option>
              ))}
            </select>

            <button
              onClick={() => currentStudent && onOpenReportCard(currentStudent)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{t.printReportCard}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Timetable & Academic Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Timetable (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              {language === 'km' ? 'កាលវិភាគសិក្សារបស់ខ្ញុំ' : 'My Weekly Class Schedule'}
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              ថ្នាក់ទី {currentStudent?.grade}{currentStudent?.section}
            </span>
          </div>

          <div className="space-y-3">
            {timetable.map((tt) => {
              const sub = subjects.find((s) => s.id === tt.subjectId);
              const tch = teachers.find((t) => t.id === tt.teacherId);
              return (
                <div
                  key={tt.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                      {tt.dayOfWeek}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {sub ? sub.nameKh : tt.subjectId} ({sub?.nameEn})
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        គ្រូ៖ {tch ? tch.nameKh : tt.teacherId} • {tt.room}
                      </span>
                    </div>
                  </div>
                  <div className="font-mono font-semibold text-slate-600 text-right">
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                    {tt.timeSlot}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scores & Files (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Scores */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              {language === 'km' ? 'ពិន្ទុ និងនិទ្ទេសរបស់ខ្ញុំ' : 'My Subject Scores'}
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {studentGrades.map((g) => {
                const sub = subjects.find((s) => s.id === g.subjectId);
                return (
                  <div key={g.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {sub ? sub.nameKh : g.subjectId}
                      </span>
                      <span className="text-[11px] text-slate-400">{g.comment || 'លទ្ធផលល្អ'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{g.score}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                        {g.letterGrade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study resources download */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              {language === 'km' ? 'ឯកសារមេរៀន និងវិញ្ញាសា' : 'Learning Resources'}
            </h3>

            <div className="space-y-2">
              {files.slice(0, 3).map((f) => (
                <a
                  key={f.id}
                  href={f.driveUrl || f.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                >
                  <span className="font-medium text-slate-800 line-clamp-1 group-hover:text-indigo-900">
                    {language === 'km' ? f.titleKh || f.title : f.title}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
