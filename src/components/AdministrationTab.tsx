import React, { useState } from 'react';
import {
  AdminNotice,
  TimetableItem,
  TuitionRecord,
  Student,
  Subject,
  Teacher,
  Language,
} from '../types';
import { translations } from '../locales/translations';
import {
  CalendarDays,
  BellRing,
  DollarSign,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  X,
  Save,
} from 'lucide-react';

interface AdministrationTabProps {
  notices: AdminNotice[];
  onAddNotice: (notice: AdminNotice) => void;
  timetable: TimetableItem[];
  onAddTimetableItem: (item: TimetableItem) => void;
  tuitions: TuitionRecord[];
  onAddTuition: (tuition: TuitionRecord) => void;
  onUpdateTuition: (tuition: TuitionRecord) => void;
  students: Student[];
  subjects: Subject[];
  teachers: Teacher[];
  language: Language;
}

export const AdministrationTab: React.FC<AdministrationTabProps> = ({
  notices,
  onAddNotice,
  timetable,
  onAddTimetableItem,
  tuitions,
  onAddTuition,
  onUpdateTuition,
  students,
  subjects,
  teachers,
  language,
}) => {
  const t = translations[language];
  const [subTab, setSubTab] = useState<'notices' | 'timetable' | 'tuition'>('notices');

  // Modals
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState<Partial<AdminNotice>>({
    priority: 'normal',
    targetAudience: 'all',
  });

  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [feeForm, setFeeForm] = useState<Partial<TuitionRecord>>({
    currency: 'USD',
    status: 'pending',
    dueDate: '2026-11-01',
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.titleKh || !noticeForm.contentKh) return;

    onAddNotice({
      id: `not-${Date.now()}`,
      titleKh: noticeForm.titleKh || '',
      titleEn: noticeForm.titleEn || noticeForm.titleKh || '',
      contentKh: noticeForm.contentKh || '',
      contentEn: noticeForm.contentEn || noticeForm.contentKh || '',
      targetAudience: noticeForm.targetAudience as any || 'all',
      priority: noticeForm.priority as any || 'normal',
      date: new Date().toISOString().split('T')[0],
      author: 'ការិយាល័យរដ្ឋបាល',
    });
    setIsNoticeModalOpen(false);
  };

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.studentId || !feeForm.amount) return;

    onAddTuition({
      id: `fee-${Date.now()}`,
      studentId: feeForm.studentId || students[0]?.id || '',
      feeTitleKh: feeForm.feeTitleKh || 'ថ្លៃសិក្សាឆមាសទី១',
      feeTitleEn: feeForm.feeTitleEn || 'Semester 1 Tuition Fee',
      amount: Number(feeForm.amount) || 0,
      currency: feeForm.currency as any || 'USD',
      status: feeForm.status as any || 'pending',
      dueDate: feeForm.dueDate || '2026-11-01',
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsFeeModalOpen(false);
  };

  const markFeePaid = (item: TuitionRecord) => {
    onUpdateTuition({
      ...item,
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
    });
  };

  const totalFeeCollected = tuitions
    .filter((t) => t.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalFeePending = tuitions
    .filter((t) => t.status === 'pending' || t.status === 'overdue')
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-tab Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.adminAffairs}</h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'កាលវិភាគបង្រៀន សេចក្តីជូនដំណឹងទូទៅ និងការតាមដានថ្លៃសិក្សា'
              : 'Class timetables, institutional circulars, and tuition fee management'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSubTab('notices')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              subTab === 'notices'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.announcements}
          </button>
          <button
            onClick={() => setSubTab('timetable')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              subTab === 'timetable'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.timetable}
          </button>
          <button
            onClick={() => setSubTab('tuition')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              subTab === 'tuition'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.tuitionFees}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Notices & Circulars */}
      {subTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">
              {language === 'km' ? 'បញ្ជីសេចក្តីជូនដំណឹង និងសារាចរណែនាំ' : 'School Notices & Policy Directives'}
            </h3>
            <button
              onClick={() => setIsNoticeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addAnnouncement}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        notice.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : notice.priority === 'important'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {notice.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">{notice.date}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-2">
                    {language === 'km' ? notice.titleKh : notice.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'km' ? notice.contentKh : notice.contentEn}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>ប្រភព៖ {notice.author}</span>
                  <span className="font-semibold text-indigo-600">
                    សម្រាប់៖ {notice.targetAudience === 'all' ? 'ទាំងអស់គ្នា' : notice.targetAudience}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Timetable */}
      {subTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-4 border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.timetable}</h3>
              <p className="text-xs text-slate-500">
                {language === 'km' ? 'កាលវិភាគបង្រៀនប្រចាំសប្តាហ៍ ថ្នាក់ទី ១០A' : 'Weekly Timetable - Grade 10A'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              ឆ្នាំសិក្សា ២០២៥-២០២៦
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-700 border-b border-slate-200">
                  <th className="p-3 border border-slate-200 w-28">ថ្ងៃ (Day)</th>
                  <th className="p-3 border border-slate-200 w-32">ម៉ោងសិក្សា (Slot)</th>
                  <th className="p-3 border border-slate-200">មុខវិជ្ជា (Subject)</th>
                  <th className="p-3 border border-slate-200">គ្រូបង្រៀន (Teacher)</th>
                  <th className="p-3 border border-slate-200 w-32">បន្ទប់ (Room)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {timetable.map((item) => {
                  const sub = subjects.find((s) => s.id === item.subjectId);
                  const tch = teachers.find((t) => t.id === item.teacherId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 border border-slate-200 font-bold text-indigo-950">
                        {item.dayOfWeek}
                      </td>
                      <td className="p-3 border border-slate-200 font-mono text-slate-600">
                        {item.timeSlot}
                      </td>
                      <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                        {sub ? sub.nameKh : item.subjectId} ({sub?.nameEn})
                      </td>
                      <td className="p-3 border border-slate-200 text-slate-700">
                        {tch ? tch.nameKh : item.teacherId}
                      </td>
                      <td className="p-3 border border-slate-200 text-slate-600 font-medium">
                        {item.room}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Tuition and Fees */}
      {subTab === 'tuition' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">ប្រាក់បានបង់សរុប (Collected)</span>
              <span className="text-2xl font-black text-emerald-600">${totalFeeCollected}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">ប្រាក់នៅសល់/ហួសកាល (Pending)</span>
              <span className="text-2xl font-black text-rose-600">${totalFeePending}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">វិក្កយបត្រសរុប</span>
                <span className="text-2xl font-black text-slate-900">{tuitions.length}</span>
              </div>
              <button
                onClick={() => setIsFeeModalOpen(true)}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                + {t.addFeeRecord}
              </button>
            </div>
          </div>

          {/* Tuition Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-xs font-bold text-slate-600 border-b border-slate-200">
                    <th className="p-3.5">វិក្កយបត្រ</th>
                    <th className="p-3.5">សិស្ស (Student)</th>
                    <th className="p-3.5">ការពិពណ៌នា</th>
                    <th className="p-3.5">ចំនួនទឹកប្រាក់</th>
                    <th className="p-3.5">ថ្ងៃកំណត់</th>
                    <th className="p-3.5">ស្ថានភាព</th>
                    <th className="p-3.5 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tuitions.map((fee) => {
                    const student = students.find((s) => s.id === fee.studentId);
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-mono font-bold text-indigo-700">
                          {fee.invoiceNumber}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block">
                            {student ? student.nameKh : 'សិស្ស'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            ថ្នាក់ {student?.grade}{student?.section}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700">{fee.feeTitleKh}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          ${fee.amount} {fee.currency}
                        </td>
                        <td className="p-3.5 text-slate-600">{fee.dueDate}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              fee.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : fee.status === 'overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {fee.status === 'paid'
                              ? t.paid
                              : fee.status === 'overdue'
                              ? t.overdue
                              : t.pending}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {fee.status !== 'paid' ? (
                            <button
                              type="button"
                              onClick={() => markFeePaid(fee)}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-300 transition-colors cursor-pointer"
                            >
                              ✓ កត់ត្រាថាបានបង់
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              បង់នៅ {fee.paidDate}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Notice */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-400" />
                {t.addAnnouncement}
              </h3>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ចំណងជើងសេចក្តីជូនដំណឹង</label>
                <input
                  type="text"
                  required
                  value={noticeForm.titleKh || ''}
                  onChange={(e) => setNoticeForm({ ...noticeForm, titleKh: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="ឧ. សេចក្តីជូនដំណឹងស្តីពី..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">អាទិភាព (Priority)</label>
                  <select
                    value={noticeForm.priority || 'normal'}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="normal">ធម្មតា (Normal)</option>
                    <option value="important">សំខាន់ (Important)</option>
                    <option value="urgent">បន្ទាន់ (Urgent)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">សម្រាប់ (Audience)</label>
                  <select
                    value={noticeForm.targetAudience || 'all'}
                    onChange={(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">ទាំងអស់គ្នា (All)</option>
                    <option value="teachers">គ្រូបង្រៀន (Teachers)</option>
                    <option value="parents">មាតាបិតា (Parents)</option>
                    <option value="students">សិស្ស (Students)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ខ្លឹមសារលម្អិត</label>
                <textarea
                  rows={4}
                  required
                  value={noticeForm.contentKh || ''}
                  onChange={(e) => setNoticeForm({ ...noticeForm, contentKh: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  placeholder="សរសេរខ្លឹមសារ..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Fee Record */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                {t.addFeeRecord}
              </h3>
              <button
                onClick={() => setIsFeeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ជ្រើសរើសសិស្ស</label>
                <select
                  value={feeForm.studentId || ''}
                  onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                >
                  <option value="">-- ជ្រើសរើសសិស្ស --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameKh} ({s.code}) - ថ្នាក់ {s.grade}{s.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ការពិពណ៌នាថ្លៃសិក្សា</label>
                <input
                  type="text"
                  required
                  value={feeForm.feeTitleKh || ''}
                  onChange={(e) => setFeeForm({ ...feeForm, feeTitleKh: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="ឧ. ថ្លៃសិក្សាឆមាសទី១"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ចំនួនទឹកប្រាក់ ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={feeForm.amount || ''}
                    onChange={(e) => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ថ្ងៃកំណត់បង់ (Due Date)</label>
                  <input
                    type="date"
                    required
                    value={feeForm.dueDate || '2026-11-01'}
                    onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
