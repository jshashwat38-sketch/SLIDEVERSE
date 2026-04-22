import Link from "next/link";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden text-center">
        <div className="bg-emerald-50 py-12 px-8 border-b border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-emerald-800 font-medium">Order #ORD-{Math.floor(Math.random() * 100000)} has been confirmed.</p>
        </div>
        
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Files Are Ready</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You can download your digital assets immediately using the link below.
            </p>
            
            <a 
              href="https://drive.google.com/drive/folders/placeholder-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl gap-3 transition-transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30"
            >
              <Download className="w-5 h-5" />
              Access Google Drive Folder
            </a>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 flex items-start text-left gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Backup Delivery</h3>
              <p className="text-sm text-gray-600">
                A backup copy of your purchase will also be delivered via Email within 24 hours. Keep an eye on your inbox!
              </p>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100">
            <Link href="/" className="inline-flex items-center text-primary font-semibold hover:text-primary-hover gap-2">
              Return to Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
