import React, { useState } from 'react';
import { Student, Subject, GradeRecord, Language } from '../types';
import { translations } from '../locales/translations';
import {
  Award,
  Save,
  FileSpreadsheet,
  CheckCircle,
  TrendingUp,
  Percent,
  Search,
  Check,
} from 'lucide-react';

interface GradesTabProps {
  students: Student[];
  subjects: Subject[];
  grades: GradeRecord[];
  onSaveGrades: (updatedGrades: GradeRecord[]) => void;
  onOpenSheetsModal: () => void;
  language: Language;
}

export const GradesTab: React.FC<GradesTabProps> = ({
  students,
  subjects,
  grades,
  onSaveGrades,
  onOpenSheetsModal,
  language,
}) => {
  const t = translations[language];
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[1]?.id || 'sub-math');
  const [selectedMonth, setSelectedMonth] = useState('តុលា');
  const [selectedSemester, setSelectedSemester] = useState<'Semester 1' | 'Semester 2'>('Semester 1');
  const [scoreInputs, setScoreInputs] = useState<{ [studentId: string]: number }>({});
  const [commentInputs, setCommentInputs] = useState<{ [studentId: string]: string }>({});
  const [saveAlert, setSaveAlert] = useState(false);

  // Filter students by selected class
  const classStudents = students.filter(
    (s) => s.grade === selectedGrade && s.section === selectedSection
  );

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const getLetter = (score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (score >= 85) return 'A';
    if (score >= 75) return 'B';
    if (score >= 65) return 'C';
    if (score >= 50) return 'D';
    if (score >= 40) return 'E';
    return 'F';
  };

  const handleScoreChange = (studentId: string, valStr: string) => {
    const val = Math.min(100, Math.max(0, Number(valStr) || 0));
    setScoreInputs((prev) => ({ ...prev, [studentId]: val }));
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    setCommentInputs((prev) => ({ ...prev, [studentId]: comment }));
  };

  const handleSaveAll = () => {
    const newOrUpdatedRecords: GradeRecord[] = [...grades];

    classStudents.forEach((student) => {
      // Current existing score or input
      const existing = grades.find(
        (g) =>
          g.studentId === student.id &&
          g.subjectId === selectedSubjectId &&
          g.month === selectedMonth &&
          g.semester === selectedSemester
      );

      const score = scoreInputs[student.id] !== undefined ? scoreInputs[student.id] : existing?.score || 0;
      const comment = commentInputs[student.id] !== undefined ? commentInputs[student.id] : existing?.comment || '';

      if (existing) {
        const index = newOrUpdatedRecords.findIndex((r) => r.id === existing.id);
        if (index !== -1) {
          newOrUpdatedRecords[index] = {
            ...existing,
            score,
            letterGrade: getLetter(score),
            comment,
            dateRecorded: new Date().toISOString().split('T')[0],
          };
        }
      } else {
        newOrUpdatedRecords.push({
          id: `grd-${Date.now()}-${student.id}`,
          studentId: student.id,
          subjectId: selectedSubjectId,
          month: selectedMonth,
          semester: selectedSemester,
          score,
          letterGrade: getLetter(score),
          comment,
          dateRecorded: new Date().toISOString().split('T')[0],
        });
      }
    });

    onSaveGrades(newOrUpdatedRecords);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  // Quick stats
  let totalClassScore = 0;
  let countPassed = 0;
  classStudents.forEach((st) => {
    const ex = grades.find(
      (g) =>
        g.studentId === st.id &&
        g.subjectId === selectedSubjectId &&
        g.month === selectedMonth &&
        g.semester === selectedSemester
    );
    const sc = scoreInputs[st.id] !== undefined ? scoreInputs[st.id] : ex?.score || 0;
    totalClassScore += sc;
    if (sc >= 50) countPassed++;
  });
  const avgClassScore = classStudents.length > 0 ? totalClassScore / classStudents.length : 0;
  const passRate = classStudents.length > 0 ? (countPassed / classStudents.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.gradeManagement}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {selectedSubject?.nameKh} ({selectedSubject?.nameEn})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'កត់ត្រា និងគណនាពិន្ទុប្រចាំខែ និទ្ទេសស្វ័យប្រវត្តិ (A-F) និងនាំចេញទៅ Sheets'
              : 'Record monthly subject scores, compute GPA & ranks, and export to Google Sheets'}
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
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveGrades}</span>
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'km' ? 'បានរក្សាទុកពិន្ទុដោយជោគជ័យ!' : 'Grades saved successfully!'}</span>
        </div>
      )}

      {/* Selector Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">{t.selectClass}</label>
          <div className="flex gap-1.5">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
            >
              <option value="10">ថ្នាក់ទី ១០</option>
              <option value="11">ថ្នាក់ទី ១១</option>
              <option value="12">ថ្នាក់ទី ១២</option>
            </select>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium text-center"
            >
              <option value="A">បន្ទប់ A</option>
              <option value="B">បន្ទប់ B</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">{t.selectSubject}</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.nameKh} ({sub.nameEn}) [មេគុណ: {sub.coefficient}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">{t.selectMonth}</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="តុលា">ខែ តុលា (October)</option>
            <option value="វិច្ឆិកា">ខែ វិច្ឆិកា (November)</option>
            <option value="ធ្នូ">ខែ ធ្នូ (December)</option>
            <option value="មករា">ខែ មករា (January)</option>
            <option value="កុម្ភៈ">ខែ កុម្ភៈ (February)</option>
            <option value="មីនា">ខែ មីនា (March)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">{t.selectSemester}</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
          >
            <option value="Semester 1">ឆមាសទី ១ (Semester 1)</option>
            <option value="Semester 2">ឆមាសទី ២ (Semester 2)</option>
          </select>
        </div>
      </div>

      {/* Class Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">សិស្សក្នុងថ្នាក់</span>
          <span className="text-lg font-bold text-slate-900">{classStudents.length} នាក់</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">មធ្យមភាគថ្នាក់</span>
          <span className="text-lg font-bold text-indigo-700">{avgClassScore.toFixed(1)} / 100</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">អត្រាជាប់</span>
          <span className="text-lg font-bold text-emerald-700">{passRate.toFixed(0)}%</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 block">មេគុណមុខវិជ្ជា</span>
          <span className="text-lg font-bold text-amber-700">x {selectedSubject?.coefficient}</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">ល.រ</th>
                <th className="p-4">ឈ្មោះសិស្ស (Student)</th>
                <th className="p-4">អត្តលេខ (ID)</th>
                <th className="p-4 w-32">ពិន្ទុ (/100)</th>
                <th className="p-4 w-28 text-center">ពិន្ទុគុណ</th>
                <th className="p-4 w-24 text-center">និទ្ទេស</th>
                <th className="p-4 w-24 text-center">លទ្ធផល</th>
                <th className="p-4">មតិយោបល់គ្រូ (Remarks)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student, idx) => {
                const existing = grades.find(
                  (g) =>
                    g.studentId === student.id &&
                    g.subjectId === selectedSubjectId &&
                    g.month === selectedMonth &&
                    g.semester === selectedSemester
                );

                const currentScore =
                  scoreInputs[student.id] !== undefined
                    ? scoreInputs[student.id]
                    : existing ? existing.score : 0;
                const letter = getLetter(currentScore);
                const isPassed = currentScore >= 50;
                const weighted = currentScore * (selectedSubject?.coefficient || 1);

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
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentScore}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className="w-24 px-3 py-1.5 text-sm font-bold text-center border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        />
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-indigo-900">
                      {weighted}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          letter === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : letter === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : letter === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {letter}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold ${
                          isPassed ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isPassed ? '✓ ជាប់' : '✗ ធ្លាក់'}
                      </span>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="មតិយោបល់..."
                        value={
                          commentInputs[student.id] !== undefined
                            ? commentInputs[student.id]
                            : existing?.comment || ''
                        }
                        onChange={(e) => handleCommentChange(student.id, e.target.value)}
                        className="w-full px-3 py-1 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
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
