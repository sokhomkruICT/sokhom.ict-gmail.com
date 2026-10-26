import React, { useState } from 'react';
import { SchoolInfo, Language } from '../types';
import { translations } from '../locales/translations';
import {
  Building2,
  Users,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  Edit3,
  CheckCircle,
  Save,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface SchoolInfoTabProps {
  schoolInfo: SchoolInfo;
  onUpdateSchoolInfo: (updated: SchoolInfo) => void;
  totalStudents: number;
  totalTeachers: number;
  language: Language;
}

export const SchoolInfoTab: React.FC<SchoolInfoTabProps> = ({
  schoolInfo,
  onUpdateSchoolInfo,
  totalStudents,
  totalTeachers,
  language,
}) => {
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<SchoolInfo>(schoolInfo);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolInfo(form);
    setIsEditing(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shadow-inner flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-amber-950 uppercase">
                  {schoolInfo.code}
                </span>
                <span className="text-xs text-indigo-200">
                  {language === 'km' ? `បង្កើតឡើងតាំងពីឆ្នាំ ${schoolInfo.establishedYear}` : `Est. ${schoolInfo.establishedYear}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight text-white">
                {language === 'km' ? schoolInfo.nameKh : schoolInfo.nameEn}
              </h2>
              <p className="text-sm text-indigo-200 mt-1 italic">
                "{language === 'km' ? schoolInfo.mottoKh : schoolInfo.mottoEn}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>{isEditing ? t.cancel : t.editSchoolInfo}</span>
          </button>
        </div>

        {/* Quick Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
              <span>{t.totalStudents}</span>
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalStudents}</div>
            <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">ថ្នាក់ទី ១០-១២</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
              <span>{t.totalTeachers}</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalTeachers}</div>
            <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">គ្រប់មុខវិជ្ជាស្នូល</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
              <span>{t.totalClasses}</span>
              <Award className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">6</div>
            <div className="text-[11px] text-indigo-200 mt-0.5 font-medium">10A, 10B, 11A, 11B, 12A, 12B</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-indigo-200 text-xs mb-1">
              <span>{t.averageAttendanceRate}</span>
              <Percent className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">96.8%</div>
            <div className="text-[11px] text-emerald-300 mt-0.5 font-medium">✓ ស្ថេរភាពល្អប្រសើរ</div>
          </div>
        </div>
      </div>

      {savedNotification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{language === 'km' ? 'ព័ត៌មានសាលារៀនត្រូវបានកែប្រែដោយជោគជ័យ!' : 'School information updated successfully!'}</span>
        </div>
      )}

      {/* Profile Form (if editing) or Detail Cards */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              {t.editSchoolInfo}
            </h3>
            <span className="text-xs text-slate-500">* រាល់ការកែប្រែនឹងត្រូវរក្សាទុកក្នុងប្រព័ន្ធ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.schoolNameKh}</label>
              <input
                type="text"
                value={form.nameKh}
                onChange={(e) => setForm({ ...form, nameKh: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.schoolNameEn}</label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.schoolCode}</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.principalName} (Khmer)</label>
              <input
                type="text"
                value={form.principalNameKh}
                onChange={(e) => setForm({ ...form, principalNameKh: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.principalName} (English)</label>
              <input
                type="text"
                value={form.principalNameEn}
                onChange={(e) => setForm({ ...form, principalNameEn: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.academicYear}</label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.phone}</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.website}</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.address} (Khmer)</label>
              <input
                type="text"
                value={form.addressKh}
                onChange={(e) => setForm({ ...form, addressKh: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.ministryAffiliation}</label>
              <input
                type="text"
                value={form.ministryAffiliationKh}
                onChange={(e) => setForm({ ...form, ministryAffiliationKh: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {t.saveChanges}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed Info Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                {t.schoolProfile}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'km'
                  ? 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ ឌីជីថល គឺជាគ្រឹះស្ថានអប់រំគំរូឈានមុខគេក្នុងប្រទេសកម្ពុជា ដែលផ្តោតលើការអប់រំបែបទំនើប វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា វិស្វកម្ម គណិតវិទ្យា (STEM) និងការបណ្តុះបណ្តាលសីលធម៌ វិន័យខ្ពស់ ឆ្លើយតបទៅនឹងយុគសម័យសេដ្ឋកិច្ចឌីជីថល។'
                  : 'Preah Sisowath Digital High School is a premier model public educational institution in Cambodia focusing on STEM education, modern digital literacy, and strong civic virtue.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">{t.address}</span>
                  <span className="font-semibold text-slate-800">
                    {language === 'km' ? schoolInfo.addressKh : schoolInfo.addressEn}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">{t.phone}</span>
                  <span className="font-semibold text-slate-800">{schoolInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">{t.email}</span>
                  <span className="font-semibold text-slate-800">{schoolInfo.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Globe className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium block">{t.website}</span>
                  <a
                    href={schoolInfo.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    {schoolInfo.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Vision and Core Values */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <h4 className="font-bold text-indigo-950 text-sm mb-1">
                  {language === 'km' ? 'ចក្ខុវិស័យ (Vision)' : 'Vision'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'km'
                    ? 'កសាងមូលធនមនុស្សប្រកបដោយសមត្ថភាព បញ្ញា ស្មារតីស្នេហាជាតិ និងជំនាញបច្ចេកវិទ្យាកម្រិតខ្ពស់ដើម្បីចូលរួមអភិវឌ្ឍន៍សង្គមជាតិ។'
                    : 'To foster high-caliber human capital endowed with intellect, patriotism, and modern digital competencies.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <h4 className="font-bold text-emerald-950 text-sm mb-1">
                  {language === 'km' ? 'បេសកកម្ម (Mission)' : 'Mission'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'km'
                    ? 'ផ្តល់ការអប់រំប្រកបដោយសមធម៌ គុណភាព និងបរិយាបន្ន ព្រមទាំងបំពាក់បំប៉នបំណិនសតវត្សរ៍ទី២១ ដល់សិស្សានុសិស្សគ្រប់រូប។'
                    : 'Delivering equitable, quality, and inclusive education equipped with 21st-century skills for every learner.'}
                </p>
              </div>
            </div>
          </div>

          {/* Principal & Security Column */}
          <div className="space-y-6">
            {/* Principal Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-tr from-indigo-500 to-indigo-700 p-1 shadow-md mb-3">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-indigo-900 text-xl">
                  {schoolInfo.principalNameKh.charAt(0)}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {language === 'km' ? schoolInfo.principalNameKh : schoolInfo.principalNameEn}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 mb-2">{t.principalName}</p>
              <p className="text-xs text-slate-500 italic leading-relaxed px-2">
                "{language === 'km'
                  ? 'ការអប់រំគឺជាគន្លឹះដ៏រឹងមាំបំផុតសម្រាប់ផ្លាស់ប្តូរអនាគតកូនខ្មែរគ្រប់រូបឱ្យកាន់តែត្រចះត្រចង់។'
                  : 'Education is the most powerful catalyst to transform our children into future leaders.'}"
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>ឆ្នាំសិក្សា {schoolInfo.academicYear}</span>
              </div>
            </div>

            {/* High Security Architecture Info Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'km' ? 'សុវត្ថិភាពទិន្នន័យកម្រិតខ្ពស់' : 'Enterprise Data Security'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'km'
                  ? 'ប្រព័ន្ធត្រូវបានការពារដោយបច្ចេកវិទ្យា OAuth2 និងការផ្ទុកទិន្នន័យឯកជនភាព។ រាល់កំណត់ត្រាពិន្ទុ និងវត្តមានត្រូវបានធ្វើសមកាលកម្មដោយផ្ទាល់ទៅ Google Sheets របស់អ្នក។'
                  : 'Protected by Google OAuth2 tokenized security. Student data and records are encrypted and synced directly to your personal Google Sheets.'}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>ស្ថានភាពប្រព័ន្ធ៖</span>
                <span className="text-emerald-400 font-semibold">● ដំណើរការល្អ (Normal)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
