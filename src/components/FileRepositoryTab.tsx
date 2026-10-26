import React, { useState } from 'react';
import { SchoolFile, Language } from '../types';
import { translations } from '../locales/translations';
import {
  FolderArchive,
  FileText,
  FileCode,
  Download,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Copy,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface FileRepositoryTabProps {
  files: SchoolFile[];
  onAddFile: (file: SchoolFile) => void;
  language: Language;
}

export const FileRepositoryTab: React.FC<FileRepositoryTabProps> = ({
  files,
  onAddFile,
  language,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<SchoolFile>>({
    category: 'curriculum',
    format: 'PDF',
    fileSize: '2.5 MB',
  });

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.titleKh && f.titleKh.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (file: SchoolFile) => {
    navigator.clipboard.writeText(file.driveUrl || file.fileUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl) return;

    onAddFile({
      id: `file-${Date.now()}`,
      title: form.title || '',
      titleKh: form.titleKh || form.title || '',
      category: form.category as any || 'curriculum',
      fileUrl: form.fileUrl || '',
      driveUrl: form.driveUrl || form.fileUrl,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: form.fileSize || '1.5 MB',
      format: form.format as any || 'PDF',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.fileRepository}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {files.length} ឯកសារ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'km'
              ? 'បណ្ណាល័យតំណភ្ជាប់ឯកសារផ្លូវការ កម្មវិធីសិក្សា វិញ្ញាសាប្រឡង និង Google Drive'
              : 'Digital repository of curriculum guides, exam papers, official circulars, and Drive links'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.uploadFileLink}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'km' ? 'ស្វែងរកឯកសារ ឬតំណភ្ជាប់...' : 'Search resources or links...'}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">គ្រប់ប្រភេទឯកសារ (All Categories)</option>
            <option value="curriculum">{t.curriculum}</option>
            <option value="exam">{t.examPaper}</option>
            <option value="circular">{t.circular}</option>
            <option value="form">{t.form}</option>
            <option value="handbook">{t.handbook}</option>
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  {file.format}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                  {file.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">
                {language === 'km' ? file.titleKh || file.title : file.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3">{file.uploadDate} • {file.fileSize}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink(file)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedId === file.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{language === 'km' ? 'បានចម្លង!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyLink}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={file.driveUrl || file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>{t.openDriveLink}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add new file link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-indigo-400" />
                {t.uploadFileLink}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ចំណងជើងឯកសារ (Title)</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="ឧ. កម្មវិធីសិក្សាលម្អិត..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.fileCategory}</label>
                  <select
                    value={form.category || 'curriculum'}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="curriculum">{t.curriculum}</option>
                    <option value="exam">{t.examPaper}</option>
                    <option value="circular">{t.circular}</option>
                    <option value="form">{t.form}</option>
                    <option value="handbook">{t.handbook}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ទម្រង់ឯកសារ (Format)</label>
                  <select
                    value={form.format || 'PDF'}
                    onChange={(e) => setForm({ ...form, format: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  តំណភ្ជាប់ Google Drive / គេហទំព័រ (File URL)
                </label>
                <input
                  type="url"
                  required
                  value={form.fileUrl || ''}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value, driveUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                  placeholder="https://drive.google.com/file/d/..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
