import React, { useMemo, useState } from 'react';

const REPORT_OPTIONS = [
    { value: 'users', label: 'User Management' },
    { value: 'questions', label: 'Question Bank' },
    { value: 'test-results', label: 'Test Results' },
    { value: 'assignments', label: 'User Assignments' }
];

const FILE_FORMATS = [
    { value: 'json', label: 'JSON (.json)' },
    { value: 'csv', label: 'CSV (.csv)' }
];

const ReportsPage = () => {
    const [reportType, setReportType] = useState(REPORT_OPTIONS[0].value);
    const [fileFormat, setFileFormat] = useState(FILE_FORMATS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('info');

    const activeReportLabel = useMemo(() => {
        const selected = REPORT_OPTIONS.find(option => option.value === reportType);
        return selected ? selected.label : 'Report';
    }, [reportType]);

    const toCSV = (rows) => {
        if (!rows || rows.length === 0) return '';
        const headers = Object.keys(rows[0]);
        const escapeCell = (cell) => {
            if (cell === null || cell === undefined) return '';
            const stringified = Array.isArray(cell) ? JSON.stringify(cell) : String(cell);
            if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
                return `"${stringified.replace(/"/g, '""')}"`;
            }
            return stringified;
        };
        const headerLine = headers.join(',');
        const dataLines = rows.map(row => headers.map(header => escapeCell(row[header])).join(','));
        return [headerLine, ...dataLines].join('\n');
    };

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleGenerate = async () => {
        setStatusMessage('');
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token autentikasi tidak ditemukan. Silakan login ulang.');
            }

            const response = await fetch(`http://localhost:3001/api/reports?type=${reportType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const payload = await response.json();
            if (!response.ok) {
                throw new Error(payload.message || 'Gagal mengambil data report.');
            }

            if (!payload.data || payload.data.length === 0) {
                setStatusMessage('Data report kosong untuk menu tersebut.');
                setStatusType('warning');
                return;
            }

            let fileContent;
            let mimeType;
            let extension;

            if (fileFormat === 'csv') {
                fileContent = toCSV(payload.data);
                mimeType = 'text/csv;charset=utf-8;';
                extension = 'csv';
            } else {
                fileContent = JSON.stringify(payload.data, null, 2);
                mimeType = 'application/json;charset=utf-8;';
                extension = 'json';
            }

            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `${reportType}-report-${timestamp}.${extension}`;
            downloadFile(fileContent, filename, mimeType);

            setStatusMessage(`Report "${activeReportLabel}" berhasil diunduh (${payload.record_count} data).`);
            setStatusType('success');
        } catch (error) {
            setStatusMessage(error.message);
            setStatusType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const statusClasses = {
        success: 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-200',
        error: 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-200',
        warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-200',
        info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-200'
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">Generate Report</h3>
            <div className="space-y-6 max-w-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Report Source
                        </label>
                        <select
                            id="report-type"
                            value={reportType}
                            onChange={(event) => setReportType(event.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {REPORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="file-format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            File Format
                        </label>
                        <select
                            id="file-format"
                            value={fileFormat}
                            onChange={(event) => setFileFormat(event.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {FILE_FORMATS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium text-gray-700 dark:text-gray-100 mb-1">Ringkasan Report</p>
                    <p className="leading-relaxed">
                        Sistem akan mengekstrak data "{activeReportLabel}" langsung dari basis data sesuai dengan menu yang dipilih.
                        File akan diunduh secara otomatis setelah proses selesai.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                        isLoading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isLoading ? 'Mengunduh...' : 'Generate & Download'}
                </button>

                {statusMessage && (
                    <div className={`px-4 py-3 rounded-lg text-sm ${statusClasses[statusType]}`}>
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
