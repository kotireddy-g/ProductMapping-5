import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Bell, LogOut, User, FileText, Layout } from 'lucide-react';
import ExperienceFlowLogo from '../../assets/experienceflow-logo.svg';
import LanguageSwitcher from './LanguageSwitcher';
import ModuleSelector from './ModuleSelector';
import TemplateSelectorModal from '../TemplateSelector/TemplateSelectorModal';

const Header = ({
  currentUser,
  notifications,
  onUploadClick,
  onNotificationClick,
  onSupplierReportClick,
  onLogout,
  showNotificationBadge
}) => {
  const { t } = useTranslation();
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(
    localStorage.getItem('dashboardTemplate') || 'executive'
  );

  const handleTemplateChange = (templateId) => {
    setCurrentTemplate(templateId);
    localStorage.setItem('dashboardTemplate', templateId);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img
                src={ExperienceFlowLogo}
                alt="ExperienceFlow"
                className="w-10 h-10 rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                ExperienceFlow
              </h1>
              <p className="text-xs text-slate-500">Hospital Pharma Procurement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <button
              onClick={onUploadClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
            >
              <Upload className="w-4 h-4" />
              {t('header.uploadForecast')}
            </button>

            <button
              onClick={onSupplierReportClick}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4" />
              {t('header.supplierReport')}
            </button>

            <ModuleSelector />

            {/* Template Selector Button */}
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Change Dashboard Layout"
            >
              <Layout className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={onNotificationClick}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {currentUser?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        currentTemplate={currentTemplate}
        onTemplateChange={handleTemplateChange}
      />
    </header>
  );
};

export default Header;
