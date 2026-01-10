import { Metadata } from 'next';
import { Upload } from 'lucide-react';
import { UploadForm } from '@/components/upload-form';

export const metadata: Metadata = {
    title: 'Upload Sensitivity - SensiFinder',
    description: 'Share your gaming sensitivity settings with the community. Upload your BGMI, PUBG, Free Fire, or COD Mobile sensitivity profile.',
};

export default function UploadPage() {
    return (
        <div className="min-h-screen py-12 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-6 shadow-lg shadow-purple-500/30">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Upload Your Sensitivity
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Share your optimized sensitivity settings with the gaming community.
                        Help other players find the perfect settings for their device.
                    </p>
                </div>

                {/* Form */}
                <UploadForm />
            </div>
        </div>
    );
}
