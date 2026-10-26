import React from 'react';
import { UserRole, Language, SchoolInfo, GoogleSheetsSyncConfig } from '../types';
import { translations } from '../locales/translations';
import { User } from 'firebase/auth';
import {
  GraduationCap,
  Globe,
  FileSpreadsheet,
  Users,
  Shield,
  BookOpen,
  HeartHandshake,
  UserCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  schoolInfo: SchoolInfo;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User | null;
  syncConfig: GoogleSheetsSyncConfig;
  onOpenSheetsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  schoolInfo,
  activeRole,
  onRoleChange,
  language,
  onLanguageChange,
  currentUser,
  syncConfig,
  onOpenSheetsModal,
}) => {
  const t = translations[language];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">
              {language === 'km'
                ? `${schoolInfo.ministryAffiliationKh} • ឆ្នាំសិក្សា ${schoolInfo.academicYear}`
                : `${schoolInfo.ministryAffiliationEn} • Academic Year ${schoolInfo.academicYear}`}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>{schoolInfo.phone}</span>
            <span>•</span>
            <span className="hidden sm:inline">{schoolInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                {language === 'km' ? schoolInfo.nameKh : schoolInfo.nameEn}
              </h1>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {schoolInfo.code}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'km' ? schoolInfo.mottoKh : schoolInfo.mottoEn}
            </p>
          </div>
        </div>

        {/* Action Controls: Role Switcher, Google Sheets Status, Language */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Administrator Mode"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleAdmin}</span>
              <span className="sm:hidden">Admin</span>
            </button>
            <button
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Teacher Mode"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleTeacher}</span>
              <span className="sm:hidden">Teacher</span>
            </button>
            <button
              onClick={() => onRoleChange('parent')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeRole === 'parent'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Parent Mode"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleParent}</span>
              <span className="sm:hidden">Parent</span>
            </button>
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Student Mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.roleStudent}</span>
              <span className="sm:hidden">Student</span>
            </button>
          </div>

          {/* Google Sheets Sync Integration Button */}
          <button
            onClick={onOpenSheetsModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
              currentUser
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${currentUser ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span className="hidden md:inline">
              {currentUser ? t.sheetsConnected : t.sheetsSync}
            </span>
            {currentUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          {/* Language Toggle (Khmer / English) */}
          <button
            onClick={() => onLanguageChange(language === 'km' ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            title="Toggle Language / ប្តូរភាសា"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'km' ? 'English' : 'ភាសាខ្មែរ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
