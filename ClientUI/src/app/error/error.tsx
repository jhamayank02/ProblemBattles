import { AlertCircle } from 'lucide-react';

export default function ErrorComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    Something went wrong
                </h1>
                <p className="text-gray-600">
                    Please try again later
                </p>
            </div>
        </div>
    );
}