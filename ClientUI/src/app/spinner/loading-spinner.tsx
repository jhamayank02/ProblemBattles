const LoadingSpinner = ({ size = 'md', message = '' }) => {
    const sizeClasses: Record<string, string> = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const messageSizes: Record<string, string> = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`${sizeClasses[size]} relative`}>
                {/* Outer rotating ring */}
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-lg animate-spin"
                    style={{ animationDuration: '3s' }}></div>

                {/* Middle rotating ring */}
                <div className="absolute inset-2 border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-lg animate-spin"
                    style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>

                {/* Binary particles */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-green-500 rounded-full animate-ping"
                        style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-blue-500 rounded-full animate-ping"
                        style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                </div>
            </div>

            {message && (
                <p className={`${messageSizes[size]} text-gray-600 dark:text-gray-400 animate-pulse`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
