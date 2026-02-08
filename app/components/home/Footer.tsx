
import React from 'react';

const Footer: React.FC = () => {
  return (
   <footer className="border-t border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center font-black text-black text-[10px]">A</div>
              <span className="font-bold tracking-tighter text-white">ARCHITECT AI</span>
            </div>
            <p className="text-zinc-600 text-sm max-w-xs leading-relaxed">
              Design, analyze, and deploy systems with confidence. Our AI ensures your architecture is resilient before you write a single line of code.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Product</h5>
            <ul className="space-y-4 text-xs text-zinc-500 font-bold uppercase">
              <li><a href="#" className="hover:text-amber-500">Changelog</a></li>
              <li><a href="#" className="hover:text-amber-500">Security</a></li>
              <li><a href="#" className="hover:text-amber-500">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Resources</h5>
            <ul className="space-y-4 text-xs text-zinc-500 font-bold uppercase">
              <li><a href="#" className="hover:text-amber-500">Docs</a></li>
              <li><a href="#" className="hover:text-amber-500">API</a></li>
              <li><a href="#" className="hover:text-amber-500">Whitepapers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-white mb-6">Company</h5>
            <ul className="space-y-4 text-xs text-zinc-500 font-bold uppercase">
              <li><a href="#" className="hover:text-amber-500">Careers</a></li>
              <li><a href="#" className="hover:text-amber-500">Contact</a></li>
              <li><a href="#" className="hover:text-amber-500">Privacy</a></li>
            </ul>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
