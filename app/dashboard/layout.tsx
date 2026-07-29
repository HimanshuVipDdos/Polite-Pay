import { LayoutDashboard, FileText, Settings, Wind } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Wind className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-lg tracking-tight">
              PolitePay
            </span>
          </div>
          <nav className="p-4 space-y-1">
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 shadow-sm border border-slate-200"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-4 h-4 mr-3 text-slate-400" />
              Invoices
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3 text-slate-400" />
              Settings
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center group cursor-pointer hover:bg-slate-100 p-2 rounded-md transition-colors -mx-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900">Jane Doe</p>
              <p className="text-xs text-slate-500">jane@politepay.app</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
