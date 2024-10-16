import React from 'react';
import { FileDown } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportData';

interface ExportButtonProps {
  data: any[];
  columns: string[];
  title: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, columns, title }) => {
  return (
    <div className="dropdown inline-block relative">
      <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center">
        <FileDown className="mr-2" size={20} />
        <span>Export</span>
      </button>
      <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
        <li>
          <a
            className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap cursor-pointer"
            onClick={() => exportToPDF(data, columns, title)}
          >
            Export to PDF
          </a>
        </li>
        <li>
          <a
            className="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap cursor-pointer"
            onClick={() => exportToExcel(data, columns, title)}
          >
            Export to Excel
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ExportButton;