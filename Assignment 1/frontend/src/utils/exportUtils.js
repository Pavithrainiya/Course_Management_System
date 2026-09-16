/**
 * Export Utilities for Course Management System
 * Supports CSV generation and PDF Print Export
 */

export const exportToCSV = (filename, headers, rows) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  // Header row
  const csvContent = [];
  csvContent.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Data rows
  rows.forEach(row => {
    const rowValues = headers.map(header => {
      const val = row[header] !== undefined && row[header] !== null ? row[header] : '';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvContent.push(rowValues.join(','));
  });

  const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (title, headers, rows, filename) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to export PDF documents.');
    return;
  }

  const tableHeadersHtml = headers.map(h => `<th style="padding:10px; border:1px solid #cbd5e1; background:#f1f5f9; text-align:left; font-size:12px; font-weight:bold; color:#1e293b;">${h}</th>`).join('');
  
  const tableRowsHtml = rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const cells = headers.map(h => `<td style="padding:8px 10px; border:1px solid #cbd5e1; font-size:12px; color:#334155;">${row[h] !== undefined && row[h] !== null ? row[h] : ''}</td>`).join('');
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - Report</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #0f172a; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #0f172a; }
        .meta { font-size: 12px; color: #64748b; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">🎓 Course Management System</div>
          <div style="font-size:14px; color:#0284c7; font-weight:600; margin-top:4px;">${title}</div>
        </div>
        <div class="meta">
          <div>Generated: ${new Date().toLocaleString()}</div>
          <div>Total Records: ${rows.length}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        Confidential Report • Course Management System Administrator Portal
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
