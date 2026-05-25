import { useState } from 'react';
import { PublicNavbar } from '@/components/public-navbar';
import { PublicSidebar } from '@/components/public-sidebar';
import { FlashMessages } from '@/components/flash-messages';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cursor-canvas flex flex-col selection:bg-cursor-primary/10 selection:text-cursor-primary font-sans">
            <PublicNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 pt-16 relative">
                <PublicSidebar isOpen={isSidebarOpen} />
                
                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 z-30 bg-cursor-ink/10 backdrop-blur-sm md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 w-full md:ml-52 transition-all duration-300 min-w-0">
                    <div className="max-w-[1200px] mx-auto min-h-[calc(100vh-64px)]">
                        {children}
                    </div>
                    
                    <footer className="mt-cursor-section py-16 px-12 border-t border-cursor-hairline bg-cursor-canvas text-left">
                        <div className="max-w-[1200px] mx-auto">
                            <p className="text-cursor-muted text-sm leading-relaxed">
                                © {new Date().getFullYear()} DevPorto. Built with quietly-confident precision.<br/>
                                <span className="text-cursor-muted-soft">Crafted by Dicky Adi Saputra.</span>
                            </p>
                        </div>
                    </footer>
                </main>
            </div>
            
            <FlashMessages />
        </div>
    );
}
