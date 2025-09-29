// CSV Export utilities for admin data

export interface CSVExportable {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Convert array of objects to CSV format
 */
export function convertToCSV<T extends CSVExportable>(data: T[], headers?: string[]): string {
  // Get headers from first object if not provided, or use provided headers
  const csvHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);
  
  // If no headers available, return empty string
  if (csvHeaders.length === 0) return '';
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // If no data, return just headers
  if (data.length === 0) {
    return headerRow;
  }
  
  // Create data rows
  const dataRows = data.map(item => {
    return csvHeaders.map(header => {
      const value = item[header];
      // Handle null/undefined values
      if (value === null || value === undefined) return '';
      
      let stringValue = String(value);
      
      // Prevent CSV formula injection by escaping dangerous characters
      // Prefix values starting with =, +, -, @, or whitespace with a single quote
      if (stringValue.match(/^[\s=+\-@]/)) {
        stringValue = "'" + stringValue;
      }
      
      // Escape commas and quotes in text values
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file with UTF-8 BOM for Excel compatibility
 */
export function downloadCSV(csv: string, filename: string): void {
  // Add UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csv;
  
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL to prevent memory leaks
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
}

/**
 * Format currency for CSV export
 */
export function formatCurrencyForCSV(amount: string | number): string {
  return Number(amount).toFixed(2);
}