import React from 'react';
import { Mail } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';

const VerifyEmailPage = () => {
    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/* Left Side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                            <Mail className='size-6 text-primary' />
                        </div>
                        <h1 className='text-2xl font-bold mt-2'>Verify Your Email</h1>
                        <p className="text-base-content/60">A verification email was sent to your registered email. Please verify your email to continue!</p>
                    </div>
                </div>
            </div>
            
            {/* Right Side */}
            <AuthImagePattern
                title="Almost there!"
                subtitle="Check your inbox for a verification link."
            />
        </div>
    );
}

export default VerifyEmailPage;
