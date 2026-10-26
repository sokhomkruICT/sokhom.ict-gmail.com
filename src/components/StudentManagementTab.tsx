import React, { useState } from 'react';
import { Student, Language } from '../types';
import { translations } from '../locales/translations';
import { ConfirmationModal } from './ConfirmationModal';
import {
  GraduationCap,
  UserPlus,
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Award,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Save,
  FileText,
} from 'lucide-react';

interface StudentManagementTabProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenReportCard: (student: Student) => void;
  language: Language;
}

export const StudentManagementTab: React.FC<StudentManagementTabProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenReportCard,
  language,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Deletion confirmation
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<Student>>({
    gender: 'M',
    grade: '10',
    section: 'A',
    status: 'enrolled',
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianNameKh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const openAddModal = () => {
    setEditingStudent(null);
    setForm({
      id: `stu-${Date.now()}`,
      code: `STU-10A-0${students.length + 1}`,
      nameKh: '',
      nameEn: '',
      gender: 'M',
      dob: '2009-01-01',
      grade: '10',
      section: 'A',
      guardianNameKh: '',
      guardianNameEn: '',
      guardianPhone: '',
      guardianRelationshipKh: 'ឪពុក',
      guardianRelationshipEn: 'Father',
      address: 'រាជធានីភ្នំពេញ',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'enrolled',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setForm(student);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameKh || !form.grade || !form.guardianPhone) return;

    if (editingStudent) {
      onUpdateStudent(form as Student);
    } else {
      onAddStudent(form as Student);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Enrollment Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.studentList}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {students.length} នាក់
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'គ្រប់គ្រងបញ្ជីឈ្មោះសិស្ស ព័ត៌មានអាណាព្យាបាល ព្រឹត្តិបត្រពិន្ទុ និងវត្តមាន'
              : 'Manage student roster, guardian contacts, official report cards, and status'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addStudent}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchStudent}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t.allGrades}</option>
            <option value="10">ថ្នាក់ទី ១០ (Grade 10)</option>
            <option value="11">ថ្នាក់ទី ១១ (Grade 11)</option>
            <option value="12">ថ្នាក់ទី ១២ (Grade 12)</option>
          </select>
        </div>
      </div>

      {/* Student Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">សិស្ស (Student)</th>
                <th className="p-4">អត្តលេខ (ID)</th>
                <th className="p-4">ថ្នាក់ (Grade)</th>
                <th className="p-4">ភេទ & ថ្ងៃកំណើត</th>
                <th className="p-4">អាណាព្យាបាល (Guardian)</th>
                <th className="p-4">ស្ថានភាព</th>
                <th className="p-4 text-right">សកម្មភាព (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.nameEn}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{student.nameKh}</div>
                        <div className="text-xs text-slate-500">{student.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {student.code}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ថ្នាក់ទី {student.grade}{student.section}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <div>{student.gender === 'M' ? t.male : t.female}</div>
                    <div className="text-slate-400">{student.dob}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-medium text-slate-800">
                      {student.guardianNameKh} ({student.guardianRelationshipKh})
                    </div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {student.guardianPhone}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.status === 'enrolled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.status === 'suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {student.status === 'enrolled'
                        ? t.enrolled
                        : student.status === 'suspended'
                        ? t.suspended
                        : t.graduated}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Print / View Report Card Button */}
                      <button
                        onClick={() => onOpenReportCard(student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        title={t.printReportCard}
                      >
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.printReportCard}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(student)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title={t.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setStudentToDelete(student)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                {editingStudent ? t.edit : t.addStudent}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះសិស្ស (Khmer)</label>
                  <input
                    type="text"
                    required
                    value={form.nameKh || ''}
                    onChange={(e) => setForm({ ...form, nameKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="ឧ. ជា វឌ្ឍនៈ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះឡាតាំង (English)</label>
                  <input
                    type="text"
                    required
                    value={form.nameEn || ''}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Chea Vathana"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">អត្តលេខ</label>
                  <input
                    type="text"
                    required
                    value={form.code || ''}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.gender}</label>
                  <select
                    value={form.gender || 'M'}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="M">{t.male}</option>
                    <option value="F">{t.female}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.dob}</label>
                  <input
                    type="date"
                    required
                    value={form.dob || '2009-01-01'}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.grade}</label>
                  <select
                    value={form.grade || '10'}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="10">ថ្នាក់ទី ១០</option>
                    <option value="11">ថ្នាក់ទី ១១</option>
                    <option value="12">ថ្នាក់ទី ១២</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.section}</label>
                  <select
                    value={form.section || 'A'}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="A">បន្ទប់ A</option>
                    <option value="B">បន្ទប់ B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.status}</label>
                  <select
                    value={form.status || 'enrolled'}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="enrolled">{t.enrolled}</option>
                    <option value="suspended">{t.suspended}</option>
                    <option value="graduated">{t.graduated}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.guardian} (Khmer)</label>
                  <input
                    type="text"
                    required
                    value={form.guardianNameKh || ''}
                    onChange={(e) => setForm({ ...form, guardianNameKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="ឈ្មោះឪពុក ឬម្តាយ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.guardianPhone}</label>
                  <input
                    type="text"
                    required
                    value={form.guardianPhone || ''}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="012 888 999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.address}</label>
                <input
                  type="text"
                  value={form.address || ''}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ រាជធានី"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(studentToDelete)}
        title={language === 'km' ? 'បញ្ជាក់ការលុបសិស្ស' : 'Confirm Student Deletion'}
        message={
          language === 'km'
            ? `តើអ្នកពិតជាចង់លុបសិស្ស ${studentToDelete?.nameKh} (${studentToDelete?.code}) មែនទេ? រាល់ប្រវត្តិនឹងត្រូវលុបចេញពីប្រព័ន្ធ។`
            : `Are you sure you want to delete ${studentToDelete?.nameEn} (${studentToDelete?.code})? All records will be removed.`
        }
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        isDestructive={true}
        onConfirm={() => {
          if (studentToDelete) onDeleteStudent(studentToDelete.id);
          setStudentToDelete(null);
        }}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};
