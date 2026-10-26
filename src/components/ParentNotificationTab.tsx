import React, { useState } from 'react';
import {
  Student,
  ParentNotification,
  LeaveRequest,
  Language,
} from '../types';
import { translations } from '../locales/translations';
import {
  Bell,
  Send,
  MessageSquare,
  CheckCircle,
  Clock,
  Check,
  X,
  FileCheck2,
  Calendar,
  Phone,
  UserCheck,
  SendHorizontal,
} from 'lucide-react';

interface ParentNotificationTabProps {
  students: Student[];
  notifications: ParentNotification[];
  onAddNotification: (notification: ParentNotification) => void;
  leaveRequests: LeaveRequest[];
  onUpdateLeaveRequest: (updated: LeaveRequest) => void;
  language: Language;
}

export const ParentNotificationTab: React.FC<ParentNotificationTabProps> = ({
  students,
  notifications,
  onAddNotification,
  leaveRequests,
  onUpdateLeaveRequest,
  language,
}) => {
  const t = translations[language];
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedType, setSelectedType] = useState<ParentNotification['type']>('attendance');
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'sms'>('telegram');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Template suggestions
  const applyTemplate = (type: ParentNotification['type']) => {
    setSelectedType(type);
    if (!selectedStudent) return;

    if (type === 'attendance') {
      setCustomTitle('ការជូនដំណឹងអំពីអវត្តមានសិស្ស');
      setCustomMessage(
        `សួស្តីលោក/លោកស្រី ${selectedStudent.guardianNameKh} អាណាព្យាបាលសិស្ស ${selectedStudent.nameKh} (ថ្នាក់ទី ${selectedStudent.grade}${selectedStudent.section})។ សិស្សបានអវត្តមានពីថ្នាក់រៀននៅថ្ងៃនេះ ដោយពុំទាន់មានលិខិតសុំច្បាប់។ សូមទំនាក់ទំនងមកកាន់សាលា។`
      );
    } else if (type === 'grade') {
      setCustomTitle('របាយការណ៍លទ្ធផលសិក្សាប្រចាំខែ');
      setCustomMessage(
        `សូមគោរពជម្រាបជូនលោក/លោកស្រី ${selectedStudent.guardianNameKh} ជ្រាបថា សាលារៀនបានចេញផ្សាយព្រឹត្តិបត្រពិន្ទុខែថ្មីរបស់សិស្ស ${selectedStudent.nameKh}។ សូមពិនិត្យមើលក្នុងប្រព័ន្ធសាលាឌីជីថល។`
      );
    } else if (type === 'conduct') {
      setCustomTitle('ការជូនដំណឹងអំពីវិន័យ និងអាកប្បកិរិយា');
      setCustomMessage(
        `សួស្តីលោក/លោកស្រី ${selectedStudent.guardianNameKh}។ គ្រូបន្ទុកថ្នាក់សូមជម្រាបជូនអំពីការប្រព្រឹត្តវិន័យរបស់សិស្ស ${selectedStudent.nameKh} ក្នុងម៉ោងសិក្សា។ សូមអញ្ជើញមកពិភាក្សាជាមួយគ្រូ។`
      );
    } else if (type === 'event') {
      setCustomTitle('ការអញ្ជើញចូលរួមកិច្ចប្រជុំមាតាបិតាសិស្ស');
      setCustomMessage(
        `សាលារៀនសូមគោរពអញ្ជើញលោក/លោកស្រី ${selectedStudent.guardianNameKh} ចូលរួមកិច្ចប្រជុំមាតាបិតាសិស្សប្រចាំឆមាស ដើម្បីពិភាក្សាអំពីវឌ្ឍនភាពការសិក្សារបស់សិស្ស ${selectedStudent.nameKh}។`
      );
    } else if (type === 'fee') {
      setCustomTitle('ការរំលឹកការបង់ថ្លៃសិក្សា');
      setCustomMessage(
        `សួស្តីលោក/លោកស្រី ${selectedStudent.guardianNameKh}។ វិក្កយបត្រថ្លៃសិក្សារបស់សិស្ស ${selectedStudent.nameKh} បានដល់កាលកំណត់ហើយ។ សូមមេត្តាទូទាត់តាមការកំណត់។ សូមអរគុណ។`
      );
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customMessage || !selectedStudentId) return;

    const newNotif: ParentNotification = {
      id: `notif-${Date.now()}`,
      studentId: selectedStudentId,
      title: customTitle,
      message: customMessage,
      type: selectedType,
      date: new Date().toLocaleString(),
      status: 'sent',
      channel: selectedChannel,
    };

    onAddNotification(newNotif);
    setSuccessBanner(true);
    setCustomTitle('');
    setCustomMessage('');
    setTimeout(() => setSuccessBanner(false), 3000);
  };

  const handleLeaveDecision = (leave: LeaveRequest, newStatus: 'approved' | 'rejected') => {
    onUpdateLeaveRequest({
      ...leave,
      status: newStatus,
      reviewedDate: new Date().toLocaleString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.parentNotifications}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              Telegram / SMS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'ប្រព័ន្ធផ្ញើសារជូនដំណឹងដោយស្វ័យប្រវត្តទៅកាន់ទូរស័ព្ទអាណាព្យាបាល និងពិនិត្យលិខិតសុំច្បាប់'
              : 'Automated notification dispatch to guardian devices and leave request approvals'}
          </p>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'km' ? 'បានផ្ញើសារជូនដំណឹងទៅកាន់អាណាព្យាបាលដោយជោគជ័យ!' : 'Notification dispatched to guardian successfully!'}</span>
        </div>
      )}

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compose Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <SendHorizontal className="w-4 h-4 text-indigo-600" />
              {t.createNotice}
            </h3>
            <span className="text-xs text-slate-500">គំរូសាររហ័ស</span>
          </div>

          {/* Quick Template Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              {language === 'km' ? 'ជ្រើសរើសគំរូសារស្វ័យប្រវត្តិ៖' : 'Choose ready-made template:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('attendance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedType === 'attendance'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.typeAttendanceAlert}
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('grade')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedType === 'grade'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.typeGradeReport}
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('conduct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedType === 'conduct'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.typeConduct}
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('event')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedType === 'event'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.typeSchoolEvent}
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('fee')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedType === 'fee'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.typeFee}
              </button>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'km' ? 'ជ្រើសរើសសិស្សទទួលសារ' : 'Select Target Student'}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameKh} ({s.code}) - ថ្នាក់ {s.grade}{s.section}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'km' ? 'ប៉ុស្តិ៍បញ្ជូន' : 'Dispatch Channel'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedChannel('telegram')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedChannel === 'telegram'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>Telegram Bot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedChannel('sms')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedChannel === 'sms'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>SMS Alert</span>
                  </button>
                </div>
              </div>
            </div>

            {selectedStudent && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">
                    {selectedStudent.guardianNameKh} ({selectedStudent.guardianRelationshipKh})
                  </span>
                  <div className="text-slate-500">ទូរស័ព្ទ៖ {selectedStudent.guardianPhone}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  ភ្ជាប់ប្រព័ន្ធរួចរាល់
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'km' ? 'ចំណងជើងសារ' : 'Alert Title'}
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="ចំណងជើងសារជូនដំណឹង..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.messageContent}</label>
              <textarea
                rows={4}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="សរសេរខ្លឹមសារលម្អិត..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendNotification}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Leave Requests from Parents & History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Leave Requests Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-500" />
                {t.leaveRequestsFromParents}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {leaveRequests.filter((r) => r.status === 'pending').length} រង់ចាំ
              </span>
            </div>

            <div className="space-y-3">
              {leaveRequests.map((req) => {
                const student = students.find((s) => s.id === req.studentId);
                return (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {student ? student.nameKh : 'សិស្ស'} (ថ្នាក់ទី {student?.grade}{student?.section})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status === 'approved' ? t.approve : req.status === 'rejected' ? t.reject : t.pending}
                      </span>
                    </div>

                    <p className="text-slate-600 italic">"{req.reason}"</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>កាលបរិច្ឆេទ៖ {req.fromDate} ដល់ {req.toDate}</span>
                      <span>ដោយ៖ {req.submittedBy}</span>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleLeaveDecision(req, 'rejected')}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        >
                          {t.reject}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLeaveDecision(req, 'approved')}
                          className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          {t.approve}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dispatch Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              {t.sentHistory}
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {notifications.slice(0, 5).map((item) => {
                const student = students.find((s) => s.id === item.studentId);
                return (
                  <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">{item.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>ផ្ញើជូន៖ {student ? student.nameKh : 'សិស្ស'}</span>
                      <span className="font-semibold text-sky-600 uppercase">
                        {item.channel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
