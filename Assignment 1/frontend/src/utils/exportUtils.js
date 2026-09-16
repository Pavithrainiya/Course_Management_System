/**
 * Robust Export Utilities for Course Management System
 * Supports CSV generation and PDF Print Export with key matching
 */

const getRowValue = (row, header) => {
  if (!row) return '';
  if (row[header] !== undefined && row[header] !== null) {
    return row[header];
  }
  // Try matching sanitized header string to object keys
  const sanitizedHeader = String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
  const matchKey = Object.keys(row).find(k => {
    const sanitizedKey = String(k).toLowerCase().replace(/[^a-z0-9]/g, '');
    return sanitizedKey === sanitizedHeader || sanitizedKey.includes(sanitizedHeader) || sanitizedHeader.includes(sanitizedKey);
  });
  if (matchKey && row[matchKey] !== undefined && row[matchKey] !== null) {
    return row[matchKey];
  }
  return '';
};

export const exportToCSV = (filename, headers, rows) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  try {
    const csvContent = [];
    // Header row
    csvContent.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

    // Data rows
    rows.forEach(row => {
      const rowValues = headers.map(header => {
        const val = getRowValue(row, header);
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvContent.push(rowValues.join(','));
    });

    const blob = new Blob(['\ufeff' + csvContent.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  } catch (err) {
    console.error('CSV Export Error:', err);
    alert('Error generating CSV file. Please try again.');
  }
};

export const exportToPDF = (title, headers, rows, filename) => {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Pop-up Blocked: Please allow pop-ups for this site in your browser to view and download the PDF report.');
    return;
  }

  const tableHeadersHtml = headers.map(h => `
    <th style="padding:12px; border:1px solid #cbd5e1; background:#0f172a; text-align:left; font-size:12px; font-weight:700; color:#f8fafc; text-transform:uppercase;">
      ${h}
    </th>
  `).join('');

  const tableRowsHtml = rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const cells = headers.map(h => {
      const val = getRowValue(row, h);
      return `<td style="padding:10px 12px; border:1px solid #e2e8f0; font-size:12px; color:#334155;">${val !== undefined && val !== null ? val : ''}</td>`;
    }).join('');
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title} - Report</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #0f172a; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00c6ff; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #0f172a; }
        .subtitle { font-size: 15px; color: #0284c7; font-weight: 700; margin-top: 4px; }
        .meta { font-size: 12px; color: #64748b; text-align: right; line-height: 1.5; }
        .actions { margin-bottom: 20px; display: flex; gap: 10px; }
        .btn-print { padding: 10px 20px; background: #0284c7; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .footer { margin-top: 36px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="actions no-print">
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="brand">🎓 Course Management System</div>
          <div class="subtitle">${title}</div>
        </div>
        <div class="meta">
          <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Total Records:</strong> ${rows.length}</div>
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
        Official Academic Report • Course Management System • Page 1 of 1
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
