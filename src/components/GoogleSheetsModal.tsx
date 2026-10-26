import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, getAccessToken } from '../services/firebase';
import { createSchoolSpreadsheet, populateSpreadsheet, SyncDataPayload } from '../services/sheetsService';
import { GoogleSheetsSyncConfig, Language } from '../types';
import { translations } from '../locales/translations';
import { ConfirmationModal } from './ConfirmationModal';
import { FileSpreadsheet, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  syncConfig: GoogleSheetsSyncConfig;
  onUpdateSyncConfig: (config: Partial<GoogleSheetsSyncConfig>) => void;
  syncPayload: SyncDataPayload;
  language: Language;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  syncConfig,
  onUpdateSyncConfig,
  syncPayload,
  language,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [customSheetId, setCustomSheetId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'sync' | null>(null);

  if (!isOpen) return null;
  const t = translations[language];

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onUserChange(res.user);
        setSuccessMsg(language === 'km' ? 'បានចូលគណនី Google ដោយជោគជ័យ!' : 'Successfully signed in with Google!');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      onUserChange(null);
      setSuccessMsg(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateCreateNew = () => {
    setPendingAction('create');
    setShowConfirmModal(true);
  };

  const handleInitiateSyncExisting = () => {
    setPendingAction('sync');
    setShowConfirmModal(true);
  };

  const executeConfirmedAction = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error(
          language === 'km'
            ? 'សូមចូលគណនី Google ជាមុនសិន ដើម្បីទទួលបានសិទ្ធិ!'
            : 'Please sign in with Google first to authorize access!'
        );
      }

      if (pendingAction === 'create') {
        const title = `${syncPayload.schoolInfo.nameKh} - ប្រព័ន្ធគ្រប់គ្រងសាលា`;
        const result = await createSchoolSpreadsheet(token, title, syncPayload);
        onUpdateSyncConfig({
          spreadsheetId: result.spreadsheetId,
          spreadsheetUrl: result.spreadsheetUrl,
          lastSyncedAt: new Date().toLocaleString(),
          status: 'success',
        });
        setSuccessMsg(t.syncSuccess);
      } else if (pendingAction === 'sync') {
        const targetId = customSheetId.trim() || syncConfig.spreadsheetId;
        if (!targetId) {
          throw new Error(
            language === 'km'
              ? 'សូមបញ្ចូល Spreadsheet ID ដែលមានស្រាប់!'
              : 'Please provide an existing Spreadsheet ID!'
          );
        }
        await populateSpreadsheet(token, targetId, syncPayload);
        const url = `https://docs.google.com/spreadsheets/d/${targetId}/edit`;
        onUpdateSyncConfig({
          spreadsheetId: targetId,
          spreadsheetUrl: url,
          lastSyncedAt: new Date().toLocaleString(),
          status: 'success',
        });
        setSuccessMsg(t.syncSuccess);
      }
    } catch (err: any) {
      console.error('Sheets operation failed:', err);
      setErrorMsg(err.message || 'Operation failed');
      onUpdateSyncConfig({ status: 'error', errorMessage: err.message });
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs">
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.googleSheetsSyncModal}</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {language === 'km'
                      ? 'សមកាលកម្មទិន្នន័យផ្ទាល់ជាមួយ Google Sheets ដោយសុវត្ថិភាព'
                      : 'Secure, real-time two-way synchronization with Google Sheets'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.googleSheetsDesc}
            </p>

            {/* Authentication status card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-xs object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    G
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {currentUser ? currentUser.displayName || currentUser.email : (language === 'km' ? 'មិនទាន់ចូលគណនី' : 'Not signed in')}
                    </span>
                    {currentUser && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'km' ? 'បានអនុញ្ញាត' : 'Authorized'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {currentUser ? currentUser.email : (language === 'km' ? 'ចុចចូលគណនី Google ដើម្បីបើកសិទ្ធិប្រើប្រាស់ Sheets' : 'Sign in to grant Sheets access')}
                  </p>
                </div>
              </div>

              <div>
                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t.signOut}
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    {t.signInWithGoogle}
                  </button>
                )}
              </div>
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Connected Spreadsheet Information */}
            {syncConfig.spreadsheetId && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'km' ? 'សៀវភៅបញ្ជីដែលបានតភ្ជាប់' : 'Active Connected Spreadsheet'}</span>
                  </div>
                  <a
                    href={syncConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${syncConfig.spreadsheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors"
                  >
                    <span>{t.openSpreadsheet}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong className="text-slate-800">Spreadsheet ID:</strong> {syncConfig.spreadsheetId}
                  </p>
                  <p>
                    <strong className="text-slate-800">{t.lastSync}:</strong>{' '}
                    {syncConfig.lastSyncedAt || (language === 'km' ? 'មិនទាន់មាន' : 'Never')}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1-click Create New Sheet */}
                <button
                  onClick={handleInitiateCreateNew}
                  disabled={isLoading || !currentUser}
                  className="flex flex-col items-start p-4 border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-emerald-950 text-sm">
                      {t.createAndSyncNewSheet}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-emerald-800 leading-snug">
                    {language === 'km'
                      ? 'បង្កើត Google Sheet ថ្មីក្នុង Drive ដោយមាន tab សិស្ស គ្រូ វត្តមាន និងពិន្ទុ'
                      : 'Creates a new Google Spreadsheet in Drive formatted with all school tabs'}
                  </p>
                </button>

                {/* Resync existing */}
                <button
                  onClick={handleInitiateSyncExisting}
                  disabled={isLoading || !currentUser || (!syncConfig.spreadsheetId && !customSheetId.trim())}
                  className="flex flex-col items-start p-4 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
                      {t.syncExistingSheet}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {language === 'km'
                      ? 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យទៅកាន់ Google Sheet ដែលកំពុងប្រើប្រាស់'
                      : 'Overwrites current data in the existing spreadsheet with latest local data'}
                  </p>
                </button>
              </div>

              {/* Optional: Enter custom spreadsheet ID */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'km' ? 'ឬបញ្ចូល Google Spreadsheet ID របស់អ្នកដោយដៃ៖' : 'Or enter custom Google Spreadsheet ID manually:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSheetId}
                    onChange={(e) => setCustomSheetId(e.target.value)}
                    placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                  <button
                    onClick={handleInitiateSyncExisting}
                    disabled={!customSheetId.trim() || !currentUser || isLoading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {language === 'km' ? 'ភ្ជាប់ & សមកាលកម្ម' : 'Link & Sync'}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 text-slate-600 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {language === 'km'
                  ? 'សុវត្ថិភាពទិន្នន័យ៖ កម្មវិធីប្រើប្រាស់ OAuth2 ផ្លូវការរបស់ Google និង token ក្នុងសតិបណ្តោះអាសន្ន។ ទិន្នន័យសាលារបស់អ្នកត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុងគណនី Google ផ្ទាល់ខ្លួនរបស់អ្នក។'
                  : 'High Security Guarantee: Uses official Google OAuth2 with ephemeral in-memory tokens. Your school records remain private inside your own Google Drive and Google Sheets.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={t.confirmSyncTitle}
        message={
          pendingAction === 'create'
            ? language === 'km'
              ? 'ប្រព័ន្ធនឹងបង្កើត Google Spreadsheet ថ្មីមួយនៅក្នុងគណនី Google Drive របស់អ្នក ហើយផ្ទេរទិន្នន័យសិស្ស គ្រូ វត្តមាន និងពិន្ទុ។ តើអ្នកយល់ព្រមបន្តឬទេ?'
              : 'The system will create a new Google Spreadsheet in your Google Drive and populate all student, teacher, attendance, and grade records. Do you wish to continue?'
            : t.confirmSyncMsg
        }
        confirmLabel={t.confirm}
        cancelLabel={t.cancel}
        onConfirm={executeConfirmedAction}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
      />
    </>
  );
};
