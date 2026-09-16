import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export const ExportButtons = ({ title, headers, data, filename = 'report' }) => {
  const handleCSV = () => {
    exportToCSV(filename, headers, data);
  };

  const handlePDF = () => {
    exportToPDF(title, headers, data, filename);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={handleCSV}
        className="btn btn-secondary btn-sm"
        title="Export dataset to Excel / CSV format"
        style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '0.825rem', gap: '6px' }}
      >
        <FileSpreadsheet size={15} color="var(--accent-emerald)" />
        Export CSV
      </button>
      <button
        onClick={handlePDF}
        className="btn btn-secondary btn-sm"
        title="Export document report to PDF"
        style={{ borderRadius: '8px', padding: '6px 12px', fontSize: '0.825rem', gap: '6px' }}
      >
        <FileText size={15} color="var(--accent-rose)" />
        Export PDF
      </button>
    </div>
  );
};
