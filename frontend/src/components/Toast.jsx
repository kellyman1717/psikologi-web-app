import React, { useEffect } from 'react';

const Toast = ({ message, type, show, onHide }) => {
    useEffect(() => {
        // Jika toast harus ditampilkan, set timer untuk memanggil `onHide` setelah 3 detik
        if (show) {
            const timer = setTimeout(() => {
                // Periksa apakah onHide benar-benar sebuah fungsi sebelum memanggilnya
                if (typeof onHide === 'function') {
                    onHide();
                }
            }, 3000);

            // Bersihkan timer jika komponen di-unmount atau `show` berubah
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    if (!show) {
        return null;
    }

    const baseClasses = 'fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-2xl text-white text-sm font-medium transition-all duration-300 animate-fade-in-down';
    
    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-600',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
            {message}
        </div>
    );
};

export default Toast;