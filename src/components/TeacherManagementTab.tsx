import React, { useState } from 'react';
import { Teacher, Language } from '../types';
import { translations } from '../locales/translations';
import { ConfirmationModal } from './ConfirmationModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  GraduationCap,
  X,
  Save,
} from 'lucide-react';

interface TeacherManagementTabProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  language: Language;
}

export const TeacherManagementTab: React.FC<TeacherManagementTabProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  language,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Confirmation state for deleting
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<Teacher>>({
    gender: 'M',
    status: 'active',
    assignedClasses: ['10A'],
  });

  const subjectsList = Array.from(new Set(teachers.map((t) => t.subject)));

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const openAddModal = () => {
    setEditingTeacher(null);
    setForm({
      id: `tch-${Date.now()}`,
      code: `T-${teachers.length + 101}`,
      nameKh: '',
      nameEn: '',
      gender: 'M',
      phone: '',
      email: '',
      subject: 'គណិតវិទ្យា',
      qualification: 'បរិញ្ញាបត្រអប់រំ (B.Ed)',
      assignedClasses: ['10A'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setForm(teacher);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameKh || !form.phone || !form.subject) return;

    if (editingTeacher) {
      onUpdateTeacher(form as Teacher);
    } else {
      onAddTeacher(form as Teacher);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.teacherList}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {teachers.length} នាក់
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'គ្រប់គ្រងព័ត៌មានលម្អិតគ្រូបង្រៀន កាលវិភាគ និងមុខវិជ្ជាទទួលបន្ទុក'
              : 'Manage faculty profiles, assigned subjects, and teaching workloads'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addTeacher}</span>
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
            placeholder={t.searchTeacher}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t.allSubjects}</option>
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.nameEn}
                    className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {teacher.nameKh}
                      </h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600">
                        {teacher.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{teacher.nameEn}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {teacher.subject}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    teacher.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : teacher.status === 'on_leave'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {teacher.status === 'active' ? t.active : teacher.status === 'on_leave' ? t.onLeave : t.inactive}
                </span>
              </div>

              {/* Qualification & Classes */}
              <div className="space-y-2 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{teacher.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-semibold text-slate-700">
                    {t.assignedClasses}: {teacher.assignedClasses.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(teacher)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                title={t.edit}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTeacherToDelete(teacher)}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title={t.delete}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                {editingTeacher ? t.edit : t.addTeacher}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.teacherName} (Khmer)</label>
                  <input
                    type="text"
                    required
                    value={form.nameKh || ''}
                    onChange={(e) => setForm({ ...form, nameKh: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="ឧ. លោកគ្រូ សុខ វិសាល"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.teacherName} (English)</label>
                  <input
                    type="text"
                    required
                    value={form.nameEn || ''}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mr. Sok Visal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.teacherCode}</label>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.phone}</label>
                  <input
                    type="text"
                    required
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="012 345 678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.email}</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="teacher@school.edu.kh"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.filterBySubject}</label>
                  <input
                    type="text"
                    required
                    value={form.subject || ''}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    placeholder="ឧ. គណិតវិទ្យា"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.status}</label>
                  <select
                    value={form.status || 'active'}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">{t.active}</option>
                    <option value="on_leave">{t.onLeave}</option>
                    <option value="inactive">{t.inactive}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.qualification}</label>
                <input
                  type="text"
                  value={form.qualification || ''}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="ឧ. បរិញ្ញាបត្រគណិតវិទ្យា"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.assignedClasses} ({language === 'km' ? 'បំបែកដោយសញ្ញាក្បៀស' : 'Comma separated'})
                </label>
                <input
                  type="text"
                  value={form.assignedClasses ? form.assignedClasses.join(', ') : ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assignedClasses: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="10A, 11A, 12A"
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
        isOpen={Boolean(teacherToDelete)}
        title={language === 'km' ? 'បញ្ជាក់ការលុបគ្រូបង្រៀន' : 'Confirm Teacher Deletion'}
        message={
          language === 'km'
            ? `តើអ្នកប្រាកដជាចង់លុបឈ្មោះ ${teacherToDelete?.nameKh} (${teacherToDelete?.code}) ចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`
            : `Are you sure you want to delete ${teacherToDelete?.nameEn} (${teacherToDelete?.code})? This action cannot be undone.`
        }
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        isDestructive={true}
        onConfirm={() => {
          if (teacherToDelete) onDeleteTeacher(teacherToDelete.id);
          setTeacherToDelete(null);
        }}
        onCancel={() => setTeacherToDelete(null)}
      />
    </div>
  );
};
