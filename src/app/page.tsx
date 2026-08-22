'use client';

import { useRouter } from 'next/navigation';
import { setStoredMode, clearLiveSession } from '@/lib/app/mode';
import { Search, MapPin, CheckCircle, FileText, Folder, Award, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  function handleTryLive() {
    setStoredMode('live');
    clearLiveSession();
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8] font-sans">
      
      {/* Top thin color bar (simulating Indian flag colors) */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>

      {/* Header Area */}
      <header className="bg-white shadow-sm z-20">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center py-3">
          
          {/* Logo Area */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
            <div className="w-12 h-14 flex items-center justify-center text-gray-800">
              <Landmark className="w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-gray-900 uppercase">Government of India</span>
              <span className="font-bold text-sm text-gray-800">भारत सरकार</span>
            </div>
          </motion.div>

          {/* Right Nav */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden md:flex items-center gap-6 text-sm font-bold text-[#0f2147]">
            <span className="cursor-pointer hover:underline transition-all">HOME</span>
            <span className="cursor-pointer hover:underline transition-all">SERVICES</span>
            <span className="cursor-pointer hover:underline transition-all">SCHEMES</span>
            <span className="cursor-pointer hover:underline transition-all">ABOUT US</span>
            <span className="cursor-pointer hover:underline transition-all">CONTACT</span>
            
            <div className="flex items-center bg-[#0f2147] rounded-md overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#138808]">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#0f2147] text-white px-3 py-1.5 w-32 focus:outline-none text-xs placeholder-blue-300"
              />
              <div className="w-6 h-6 m-1 rounded-full bg-white flex items-center justify-center shrink-0">
                <div className="w-3 h-3 rounded-full border border-blue-900" />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col z-10">
        
        {/* Background watermark graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 0.03, scale: 1 }} 
          transition={{ duration: 1.5 }}
          className="absolute top-10 right-[-10%] pointer-events-none z-0"
        >
          <Landmark className="w-[800px] h-[800px]" />
        </motion.div>

        <div className="max-w-6xl mx-auto w-full px-4 pt-16 pb-20 relative z-10 flex-1 flex flex-col justify-center">
          
          {/* Hero Text */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-[44px] font-bold text-[#0f2147] leading-tight mb-1">
              Welcome to JanSahay
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f2147] mb-4">
              जनसहाय में आपका स्वागत है
            </h2>
            <p className="text-lg text-gray-800 mb-6 max-w-md leading-relaxed">
              Your official portal for simple access to all Indian Government Digital Services.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTryLive}
              className="bg-[#0f2147] hover:bg-blue-900 text-white px-8 py-3 rounded text-lg font-bold shadow-md transition-all"
            >
              Explore All Services
            </motion.button>
          </motion.div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, borderColor: '#0f2147' }}
              className="bg-white rounded-lg p-5 border-2 border-gray-200 shadow-sm flex flex-col h-full transition-all relative cursor-pointer group"
              onClick={handleTryLive}
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="p-2 border border-gray-300 rounded flex-shrink-0 group-hover:border-[#0f2147] transition-colors">
                  <FileText className="w-10 h-10 text-gray-700 group-hover:text-[#0f2147] transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Official Source</p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#0f2147] transition-colors">Identity &<br/>Certificates</h3>
                </div>
                <div className="ml-auto">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 flex-1">
                Aadhaar card and certification carrier and fingerprint identifications.
              </p>
              <button className="mt-4 w-2/3 mx-auto bg-[#0f2147] text-white py-2 rounded text-sm font-bold shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                View Details
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, borderColor: '#0f2147' }}
              className="bg-white rounded-lg p-5 border-2 border-gray-200 shadow-sm flex flex-col h-full transition-all relative cursor-pointer group"
              onClick={handleTryLive}
            >
              <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                VERIFIED
              </div>
              <div className="flex gap-4 items-start mb-4 mt-2">
                <div className="p-2 border border-gray-300 rounded flex-shrink-0 group-hover:border-[#0f2147] transition-colors">
                  <Folder className="w-10 h-10 text-gray-700 group-hover:text-[#0f2147] transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 leading-tight group-hover:text-[#0f2147] transition-colors">Central<br/>Schemes</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 flex-1">
                Central schemes are simont folders to schemes for money bag.
              </p>
              <button className="mt-4 w-2/3 mx-auto bg-[#0f2147] text-white py-2 rounded text-sm font-bold shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                View Details
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, borderColor: '#0f2147' }}
              className="bg-white rounded-lg p-5 border-2 border-gray-200 shadow-sm flex flex-col h-full transition-all relative cursor-pointer group"
              onClick={handleTryLive}
            >
              <div className="flex gap-4 items-start mb-4">
                <div className="p-2 border border-gray-300 rounded flex-shrink-0 group-hover:border-[#0f2147] transition-colors">
                  <FileText className="w-10 h-10 text-gray-700 group-hover:text-[#0f2147] transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 leading-tight group-hover:text-[#0f2147] transition-colors">Public Services<br/>(e-District)</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 flex-1">
                Certificates for conimanitative resultin public services and certificates.
              </p>
              <button className="mt-4 w-2/3 mx-auto bg-[#0f2147] text-white py-2 rounded text-sm font-bold shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                View Details
              </button>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2147] text-white pt-8 pb-4 relative z-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 mb-6">
          
          <div className="md:col-span-1">
            <h4 className="font-bold mb-3 text-sm">Top Schemes</h4>
            <ul className="text-xs text-blue-200 space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Identity & Certificates</li>
              <li className="hover:text-white cursor-pointer transition-colors">Government Certificates</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold mb-3 text-sm">Quick Links</h4>
            <ul className="text-xs text-blue-200 space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Quick Links</li>
              <li className="hover:text-white cursor-pointer transition-colors">Quick Links</li>
            </ul>
          </div>

          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <Landmark className="w-10 h-10 text-white mb-2" />
            <span className="font-bold text-sm tracking-widest">JANSAHAY</span>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold mb-3 text-sm">Resources</h4>
            <ul className="text-xs text-blue-200 space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Resources</li>
              <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold mb-3 text-sm">Help & Support</h4>
            <ul className="text-xs text-blue-200 space-y-2">
              <li className="hover:text-white cursor-pointer transition-colors">Help & Support</li>
              <li className="hover:text-white cursor-pointer transition-colors">Help & Support</li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-blue-900 pt-3 text-center text-xs text-blue-300">
          Managed by Digital India Corporation
        </div>
        {/* Bottom thin color bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mt-3 opacity-50"></div>
      </footer>
    </div>
  );
}
