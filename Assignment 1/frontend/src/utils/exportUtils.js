/**
 * Robust Export Utilities for Course Management System
 * Supports CSV generation and PDF Print Export with key matching and dual fallbacks
 */

const getRowValue = (row, header) => {
  if (!row) return '';
  if (row[header] !== undefined && row[header] !== null) {
    return row[header];
  }
  // Match sanitized header string to object keys
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

export const exportToCSV = (filename, headers, rows = []) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  
  try {
    const csvContent = [];
    // 1. Header row
    csvContent.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

    // 2. Data rows
    safeRows.forEach(row => {
      const rowValues = headers.map(header => {
        const val = getRowValue(row, header);
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvContent.push(rowValues.join(','));
    });

    const csvString = '\ufeff' + csvContent.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const dateStr = new Date().toISOString().slice(0, 10);
    const fullFileName = `${filename}_${dateStr}.csv`;

    // Standard Blob ObjectURL download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fullFileName);

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 500);
  } catch (err) {
    console.error('CSV Export Error:', err);
    // Fallback Data URI download
    try {
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,\ufeff' + headers.join(',') + '\r\n');
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackErr) {
      alert('Failed to download CSV. Please check browser download permissions.');
    }
  }
};

export const exportToPDF = (title, headers, rows = [], filename = 'report') => {
  const safeRows = Array.isArray(rows) ? rows : [];
  
  let printWindow = null;
  try {
    printWindow = window.open('', '_blank', 'width=1050,height=850,scrollbars=yes,resizable=yes');
  } catch (e) {
    printWindow = null;
  }

  if (!printWindow) {
    // Fallback: create invisible iframe for printing if popup is blocked
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(generatePDFHtml(title, headers, safeRows));
    doc.close();
    
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }, 500);
    return;
  }

  printWindow.document.open();
  printWindow.document.write(generatePDFHtml(title, headers, safeRows));
  printWindow.document.close();
};

const generatePDFHtml = (title, headers, rows) => {
  const tableHeadersHtml = headers.map(h => `
    <th style="padding:12px; border:1px solid #cbd5e1; background:#0f172a; text-align:left; font-size:12px; font-weight:700; color:#f8fafc; text-transform:uppercase;">
      ${h}
    </th>
  `).join('');

  const tableRowsHtml = rows.length === 0 ? `
    <tr>
      <td colspan="${headers.length}" style="padding:24px; text-align:center; color:#64748b; font-size:13px; border:1px solid #e2e8f0;">
        No records currently available for this report view.
      </td>
    </tr>
  ` : rows.map((row, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const cells = headers.map(h => {
      const val = getRowValue(row, h);
      return `<td style="padding:10px 12px; border:1px solid #e2e8f0; font-size:12px; color:#334155;">${val !== undefined && val !== null ? val : ''}</td>`;
    }).join('');
    return `<tr style="background:${bg};">${cells}</tr>`;
  }).join('');

  return `
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
};
