import { useState } from 'react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicSidebar } from '@/components/public-sidebar';
import { FlashMessages } from '@/components/flash-messages';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#09090f] flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
            <PublicNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 pt-14 relative">
                <PublicSidebar isOpen={isSidebarOpen} />
                
                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 w-full md:ml-52 transition-all duration-300 min-w-0">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                    
                    <footer className="mt-20 py-12 px-6 border-t border-white/5 text-center">
                        <p className="text-white/20 text-sm">
                            © {new Date().getFullYear()} DevPorto. Built with Laravel 12 & React 19.
                        </p>
                    </footer>
                </main>
            </div>
            
            <FlashMessages />
        </div>
    );
}
