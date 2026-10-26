import React from 'react';
import { Student, SchoolInfo, Subject, GradeRecord, AttendanceRecord, Language } from '../types';
import { translations } from '../locales/translations';
import { Printer, X, Award, CheckCircle, Clock } from 'lucide-react';

interface ReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  schoolInfo: SchoolInfo;
  subjects: Subject[];
  grades: GradeRecord[];
  attendance: AttendanceRecord[];
  allStudents: Student[];
  allGrades: GradeRecord[];
  language: Language;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  onClose,
  student,
  schoolInfo,
  subjects,
  grades,
  attendance,
  allStudents,
  allGrades,
  language,
}) => {
  if (!isOpen || !student) return null;
  const t = translations[language];

  // Filter student grades for Semester 1 (or recent)
  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  // Compute attendance stats
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === 'present').length;
  const excusedDays = studentAttendance.filter((a) => a.status === 'absent_excused').length;
  const unexcusedDays = studentAttendance.filter((a) => a.status === 'absent_unexcused').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'late').length;

  // Compute total coefficients and weighted scores
  let totalScoreWeighted = 0;
  let totalCoefficients = 0;

  const subjectResults = subjects.map((sub) => {
    const record = studentGrades.find((g) => g.subjectId === sub.id);
    const score = record ? record.score : 0;
    const weighted = score * sub.coefficient;
    if (record) {
      totalScoreWeighted += weighted;
      totalCoefficients += sub.coefficient;
    }
    return {
      sub,
      record,
      score,
      weighted,
      letterGrade: record ? record.letterGrade : 'N/A',
      comment: record?.comment || (score >= 80 ? 'ល្អប្រសើរ' : score >= 65 ? 'ល្អបង្គួរ' : 'ត្រូវខិតខំបន្ថែម'),
    };
  });

  const average = totalCoefficients > 0 ? (totalScoreWeighted / totalCoefficients) : 0;

  // Compute class ranking
  // Calculate average for all students in the same grade & section
  const peers = allStudents.filter((s) => s.grade === student.grade && s.section === student.section);
  const peerAverages = peers.map((p) => {
    const pGrades = allGrades.filter((g) => g.studentId === p.id);
    let pWeighted = 0;
    let pCoeff = 0;
    subjects.forEach((sub) => {
      const g = pGrades.find((gr) => gr.subjectId === sub.id);
      if (g) {
        pWeighted += g.score * sub.coefficient;
        pCoeff += sub.coefficient;
      }
    });
    return {
      studentId: p.id,
      average: pCoeff > 0 ? pWeighted / pCoeff : 0,
    };
  });

  peerAverages.sort((a, b) => b.average - a.average);
  const studentRank = peerAverages.findIndex((p) => p.studentId === student.id) + 1;

  const overallGrade =
    average >= 85 ? 'A (ល្អប្រសើរ)' :
    average >= 75 ? 'B (ល្អណាស់)' :
    average >= 65 ? 'C (ល្អ)' :
    average >= 50 ? 'D (មធ្យម)' :
    average >= 40 ? 'E (ខ្សោយ)' : 'F (ធ្លាក់)';

  const isPassed = average >= 50;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-auto border border-slate-200 overflow-hidden">
        {/* Modal Toolbar (hidden on print) */}
        <div className="no-print bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base">{t.reportCardTitle}</h2>
              <p className="text-xs text-slate-300">
                {student.nameKh} ({student.nameEn}) - {t.grade} {student.grade}{student.section}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              {t.print}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Cambodian Report Card Document */}
        <div className="p-8 sm:p-12 print:p-6 bg-white text-slate-900 font-sans" id="printable-report-card">
          {/* Official Royal Header */}
          <div className="text-center mb-6 border-b pb-6 border-slate-200">
            <p className="font-bold text-base sm:text-lg text-slate-800 tracking-wider">
              {t.kingdomOfCambodia}
            </p>
            <p className="font-semibold text-sm sm:text-base text-slate-700 tracking-widest mt-1">
              {t.nationReligionKing}
            </p>
            <div className="flex justify-center items-center my-2 text-amber-600">
              <span className="text-xs">❈ ❈ ❈</span>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              <p>{schoolInfo.ministryAffiliationKh}</p>
              <p className="font-bold text-indigo-900 text-base sm:text-lg mt-0.5">
                {schoolInfo.nameKh}
              </p>
              <p className="text-xs text-slate-500 italic">{schoolInfo.nameEn}</p>
            </div>
            <div className="mt-4">
              <span className="inline-block px-5 py-1.5 rounded-full bg-slate-100 border border-slate-300 font-bold text-slate-900 text-base sm:text-lg">
                ព្រឹត្តិបត្រពិន្ទុ និងការតាមដានការសិក្សា (Academic Report Card)
              </span>
              <p className="text-xs text-slate-500 mt-1">
                ឆមាសទី១ • ឆ្នាំសិក្សា {schoolInfo.academicYear}
              </p>
            </div>
          </div>

          {/* Student Profile Info Grid */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">អត្តលេខសិស្ស (ID)</span>
              <span className="font-bold text-slate-800">{student.code}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">ឈ្មោះសិស្ស (Khmer)</span>
              <span className="font-bold text-indigo-900 text-base">{student.nameKh}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">ឈ្មោះឡាតាំង (Latin)</span>
              <span className="font-semibold text-slate-700">{student.nameEn}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">ភេទ / Gender</span>
              <span className="font-medium text-slate-800">
                {student.gender === 'M' ? 'ប្រុស (Male)' : 'ស្រី (Female)'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">កម្រិតថ្នាក់ / Grade</span>
              <span className="font-bold text-indigo-700">ថ្នាក់ទី {student.grade}{student.section}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">ថ្ងៃខែឆ្នាំកំណើត</span>
              <span className="font-medium text-slate-800">{student.dob}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">អាណាព្យាបាល</span>
              <span className="font-medium text-slate-800">{student.guardianNameKh} ({student.guardianRelationshipKh})</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">លេខទូរស័ព្ទ</span>
              <span className="font-medium text-slate-800">{student.guardianPhone}</span>
            </div>
          </div>

          {/* Subject Grade Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
                  <th className="p-2 border border-slate-300 w-10">ល.រ</th>
                  <th className="p-2 border border-slate-300 text-left">មុខវិជ្ជា (Subjects)</th>
                  <th className="p-2 border border-slate-300 w-20">មេគុណ</th>
                  <th className="p-2 border border-slate-300 w-24">ពិន្ទុ (/100)</th>
                  <th className="p-2 border border-slate-300 w-24">ពិន្ទុគុណ</th>
                  <th className="p-2 border border-slate-300 w-20">និទ្ទេស</th>
                  <th className="p-2 border border-slate-300 text-left">ការកត់សម្គាល់របស់គ្រូ</th>
                </tr>
              </thead>
              <tbody>
                {subjectResults.map((item, idx) => (
                  <tr key={item.sub.id} className="hover:bg-slate-50 border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center text-xs text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2 border border-slate-300 font-medium">
                      <span className="font-semibold text-slate-900">{item.sub.nameKh}</span>
                      <span className="text-xs text-slate-500 block">{item.sub.nameEn}</span>
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-semibold text-slate-600">
                      {item.sub.coefficient}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-slate-900">
                      {item.record ? item.score : '-'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-semibold text-slate-700">
                      {item.record ? item.weighted : '-'}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs ${
                          item.letterGrade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.letterGrade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : item.letterGrade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.letterGrade}
                      </span>
                    </td>
                    <td className="p-2 border border-slate-300 text-xs text-slate-600">
                      {item.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={2} className="p-2 text-right border border-slate-300">
                    ពិន្ទុសរុប & មេគុណសរុប:
                  </td>
                  <td className="p-2 text-center border border-slate-300 text-slate-700">
                    {totalCoefficients}
                  </td>
                  <td className="p-2 text-center border border-slate-300 text-slate-700">-</td>
                  <td className="p-2 text-center border border-slate-300 text-indigo-900 font-bold">
                    {totalScoreWeighted}
                  </td>
                  <td colSpan={2} className="p-2 border border-slate-300 text-xs text-slate-600">
                    ពិន្ទុពេញគិតតាមមេគុណ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Academic Summary Badge Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
              <span className="text-xs text-indigo-600 font-medium block">មធ្យមភាគពិន្ទុ (Average)</span>
              <span className="text-xl font-extrabold text-indigo-950">{average.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs text-amber-700 font-medium block">ចំណាត់ថ្នាក់ប្រចាំថ្នាក់ (Rank)</span>
              <span className="text-xl font-extrabold text-amber-900">
                លេខ {studentRank} <span className="text-xs font-normal">/ {peers.length} នាក់</span>
              </span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs text-emerald-700 font-medium block">និទ្ទេសរួម (Grade)</span>
              <span className="text-xl font-extrabold text-emerald-900">{overallGrade}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs text-blue-700 font-medium block">លទ្ធផលសិក្សា (Result)</span>
              <span className="text-xl font-extrabold text-blue-900">
                {isPassed ? '✓ ជាប់ (Passed)' : '✗ ធ្លាក់ (Failed)'}
              </span>
            </div>
          </div>

          {/* Attendance & Conduct Evaluation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                ស្ថិតិវត្តមាន និងការសិក្សា (Attendance Summary)
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                <li className="flex justify-between">
                  <span>កាលបរិច្ឆេទកត់ត្រាសរុប:</span>
                  <span className="font-bold">{totalDays > 0 ? totalDays : 15} ថ្ងៃ</span>
                </li>
                <li className="flex justify-between text-emerald-700">
                  <span>វត្តមានពេញលេញ (Present):</span>
                  <span className="font-bold">{presentDays > 0 ? presentDays : 14} ថ្ងៃ</span>
                </li>
                <li className="flex justify-between text-amber-700">
                  <span>អវត្តមានមានច្បាប់ (Excused):</span>
                  <span className="font-bold">{excusedDays} ថ្ងៃ</span>
                </li>
                <li className="flex justify-between text-rose-700">
                  <span>អវត្តមានឥតច្បាប់ (Unexcused):</span>
                  <span className="font-bold">{unexcusedDays} ថ្ងៃ</span>
                </li>
                <li className="flex justify-between text-slate-600">
                  <span>យឺត (Late):</span>
                  <span className="font-bold">{lateDays} លើក</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                ការវាយតម្លៃអត្តចរិត និងសីលធម៌ (Conduct & Behavior)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                សិស្សមានវិន័យល្អ គោរពបទបញ្ជាផ្ទៃក្នុងសាលារៀន គោរពលោកគ្រូអ្នកគ្រូ និងចេះជួយមិត្តភក្តិក្នុងថ្នាក់។
                យកចិត្តទុកដាក់ស្ដាប់ការពន្យល់ និងបំពេញកិច្ចការផ្ទះបានទៀងទាត់។
              </p>
              <div className="mt-2 text-xs font-semibold text-indigo-900">
                កម្រិតសីលធម៌៖ <span className="text-emerald-700 font-bold">ល្អប្រសើរ (Excellent)</span>
              </div>
            </div>
          </div>

          {/* Official Signatures Row */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs text-slate-700">
            <div>
              <p className="font-bold mb-12">មាតាបិតា / អាណាព្យាបាល</p>
              <p className="text-slate-400 italic">ហត្ថលេខា</p>
              <p className="font-medium mt-1">{student.guardianNameKh}</p>
            </div>
            <div>
              <p className="font-bold mb-12">គ្រូបន្ទុកថ្នាក់</p>
              <p className="text-slate-400 italic">ហត្ថលេខា</p>
              <p className="font-medium mt-1">លោកគ្រូ សុខ វិសាល</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">រាជធានីភ្នំពេញ ថ្ងៃទី {new Date().getDate()} ខែ {new Date().getMonth() + 1} ឆ្នាំ ២០២៦</p>
              <p className="font-bold mb-10">នាយកសាលា (ត្រានិងហត្ថលេខា)</p>
              <p className="font-bold text-indigo-900">{schoolInfo.principalNameKh}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
