import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, Language } from '../types';
import { translations } from '../locales/translations';
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Save,
  FileSpreadsheet,
  Calendar,
  Check,
} from 'lucide-react';

interface AttendanceTabProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (updatedAttendance: AttendanceRecord[]) => void;
  onOpenSheetsModal: () => void;
  language: Language;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  students,
  attendance,
  onSaveAttendance,
  onOpenSheetsModal,
  language,
}) => {
  const t = translations[language];
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState('2026-10-18');
  const [statusMap, setStatusMap] = useState<{ [studentId: string]: AttendanceStatus }>({});
  const [remarkMap, setRemarkMap] = useState<{ [studentId: string]: string }>({});
  const [saveAlert, setSaveAlert] = useState(false);

  const classStudents = students.filter(
    (s) => s.grade === selectedGrade && s.section === selectedSection
  );

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    if (statusMap[studentId]) return statusMap[studentId];
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    return record ? record.status : 'present';
  };

  const getStudentRemark = (studentId: string): string => {
    if (remarkMap[studentId] !== undefined) return remarkMap[studentId];
    const record = attendance.find(
      (a) => a.studentId === studentId && a.date === selectedDate
    );
    return record?.remark || '';
  };

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSetRemark = (studentId: string, remark: string) => {
    setRemarkMap((prev) => ({ ...prev, [studentId]: remark }));
  };

  const handleMarkAllPresent = () => {
    const updated: { [id: string]: AttendanceStatus } = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setStatusMap((prev) => ({ ...prev, ...updated }));
  };

  const handleSaveAttendance = () => {
    const newRecords: AttendanceRecord[] = [...attendance];

    classStudents.forEach((student) => {
      const status = getStudentStatus(student.id);
      const remark = getStudentRemark(student.id);
      const existingIdx = newRecords.findIndex(
        (a) => a.studentId === student.id && a.date === selectedDate
      );

      if (existingIdx !== -1) {
        newRecords[existingIdx] = {
          ...newRecords[existingIdx],
          status,
          remark,
        };
      } else {
        newRecords.push({
          id: `att-${Date.now()}-${student.id}`,
          studentId: student.id,
          date: selectedDate,
          status,
          remark,
        });
      }
    });

    onSaveAttendance(newRecords);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  // Metrics for current selected date & class
  let presentCount = 0;
  let excusedCount = 0;
  let unexcusedCount = 0;
  let lateCount = 0;

  classStudents.forEach((s) => {
    const st = getStudentStatus(s.id);
    if (st === 'present') presentCount++;
    if (st === 'absent_excused') excusedCount++;
    if (st === 'absent_unexcused') unexcusedCount++;
    if (st === 'late') lateCount++;
  });

  const attendanceRate =
    classStudents.length > 0
      ? ((presentCount + lateCount) / classStudents.length) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.attendanceManagement}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              ថ្នាក់ {selectedGrade}{selectedSection}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'កត់ត្រាវត្តមានប្រចាំថ្ងៃ និងតាមដានអវត្តមានមានច្បាប់/ឥតច្បាប់'
              : 'Take daily roll-call and track excused / unexcused student absences'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSheetsModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.exportToSheets}</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveAttendance}</span>
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'km' ? 'បានរក្សាទុកបញ្ជីវត្តមានដោយជោគជ័យ!' : 'Attendance sheet saved successfully!'}</span>
        </div>
      )}

      {/* Date and Class Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.selectClass}</label>
            <div className="flex gap-1.5">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                <option value="10">ថ្នាក់ទី ១០</option>
                <option value="11">ថ្នាក់ទី ១១</option>
                <option value="12">ថ្នាក់ទី ១២</option>
              </select>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
              >
                <option value="A">បន្ទប់ A</option>
                <option value="B">បន្ទប់ B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t.recordDate}</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-xs"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleMarkAllPresent}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{t.markAllPresent}</span>
        </button>
      </div>

      {/* Summary Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">សិស្សសរុប</span>
          <span className="text-xl font-bold text-slate-900">{classStudents.length} នាក់</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
          <span className="text-emerald-700 font-semibold block">{t.present}</span>
          <span className="text-xl font-extrabold text-emerald-800">{presentCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/30">
          <span className="text-amber-700 font-semibold block">{t.totalExcused}</span>
          <span className="text-xl font-extrabold text-amber-800">{excusedCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/30">
          <span className="text-rose-700 font-semibold block">{t.totalUnexcused}</span>
          <span className="text-xl font-extrabold text-rose-800">{unexcusedCount}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-purple-200 bg-purple-50/30">
          <span className="text-purple-700 font-semibold block">{t.totalLate}</span>
          <span className="text-xl font-extrabold text-purple-800">{lateCount}</span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">ល.រ</th>
                <th className="p-4">ឈ្មោះសិស្ស (Student)</th>
                <th className="p-4">អត្តលេខ</th>
                <th className="p-4 text-center">ស្ថានភាពវត្តមាន (Status)</th>
                <th className="p-4">ការកត់សម្គាល់ (Remark)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student, idx) => {
                const currentStatus = getStudentStatus(student.id);
                const currentRemark = getStudentRemark(student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 text-center text-xs font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatarUrl}
                          alt={student.nameEn}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{student.nameKh}</span>
                          <span className="text-xs text-slate-500">{student.nameEn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs font-semibold text-slate-600">
                      {student.code}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Present */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {language === 'km' ? 'វត្តមាន (P)' : 'Present'}
                        </button>

                        {/* Excused */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'absent_excused')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'absent_excused'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {language === 'km' ? 'ច្បាប់ (E)' : 'Excused'}
                        </button>

                        {/* Unexcused */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'absent_unexcused')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'absent_unexcused'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {language === 'km' ? 'ឥតច្បាប់ (U)' : 'Unexcused'}
                        </button>

                        {/* Late */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {language === 'km' ? 'យឺត (L)' : 'Late'}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={currentRemark}
                        onChange={(e) => handleSetRemark(student.id, e.target.value)}
                        placeholder="សម្គាល់ (ឧ. ផ្តាសាយ, យឺត ១០នាទី)..."
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
