import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCheck, 
  AlertTriangle, 
  LogOut, 
  Download, 
  Search,
  Bell,
  Activity,
  Briefcase,
  MessageSquare,
  Upload,
  Calendar
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { certificates, projects } = useData();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'projects'>('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Calculate Stats
  const validCerts = certificates.filter(c => c.status === 'valid').length;
  const expiringCerts = certificates.filter(c => c.status === 'expiring').length;
  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-omega-dark text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Logo variant="light" className="scale-75 origin-left" />
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-4 ml-1">Client Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-omega-blue text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'projects' ? 'bg-omega-blue text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase size={18} />
            Projects & Timeline
          </button>
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'certificates' ? 'bg-omega-blue text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck size={18} />
            Certificates
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-gray-800 capitalize">
               {activeTab}
             </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-omega-blue relative">
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-omega-blue relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
              <div className="text-sm hidden sm:block">
                <p className="font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.companyName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Valid Certificates</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{validCerts}</h3>
                    </div>
                    <FileCheck className="text-green-500 opacity-20" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Expiring Soon</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{expiringCerts}</h3>
                    </div>
                    <AlertTriangle className="text-yellow-500 opacity-20" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active Projects</p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">{activeProjects}</h3>
                    </div>
                    <Activity className="text-blue-500 opacity-20" size={32} />
                  </div>
                </div>
              </div>

              {/* Simple Chart Visualization (CSS based for dependencies constraint) */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Inspection Activity (Last 6 Months)</h3>
                <div className="flex items-end gap-4 h-48 border-b border-gray-200 pb-2">
                  {[40, 65, 30, 85, 50, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden h-full">
                         <div 
                           className="absolute bottom-0 w-full bg-omega-blue transition-all duration-1000 group-hover:bg-omega-yellow" 
                           style={{ height: `${h}%` }}
                         ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-bold">{['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
                   {[1,2,3].map(i => (
                     <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                        <div className="bg-gray-100 p-2 rounded-full"><Calendar size={16} className="text-gray-500"/></div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">Inspection Report Generated</p>
                          <p className="text-xs text-gray-500">Project P-10{i} • 2 hours ago</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-xl text-gray-800">{project.title}</h4>
                      <p className="text-sm text-gray-500">ID: {project.id} • Last Updated: {project.lastUpdated}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Stages Stepper */}
                  <div className="relative flex items-center justify-between w-full mt-8">
                     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                     {project.stages?.map((stage, idx) => (
                       <div key={idx} className="flex flex-col items-center bg-white px-2">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                           stage.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                           stage.status === 'active' ? 'bg-white border-omega-blue text-omega-blue animate-pulse' :
                           'bg-white border-gray-300 text-gray-300'
                         }`}>
                           {stage.status === 'completed' ? <FileCheck size={14}/> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                         </div>
                         <p className={`text-xs mt-2 font-bold ${stage.status === 'active' ? 'text-omega-blue' : 'text-gray-500'}`}>{stage.name}</p>
                         {stage.date && <p className="text-[10px] text-gray-400">{stage.date}</p>}
                       </div>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search equipment..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-omega-blue w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 flex items-center gap-2">
                    <Upload size={14}/> Upload New
                  </button>
                  <button className="bg-omega-blue text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-colors">
                    Request Renewal
                  </button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-bold">Equipment Name</th>
                    <th className="p-4 font-bold">Serial No.</th>
                    <th className="p-4 font-bold">Inspection Date</th>
                    <th className="p-4 font-bold">Expiry Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <td className="p-4 font-bold">{cert.equipmentName}</td>
                      <td className="p-4 font-mono text-xs">{cert.serialNumber}</td>
                      <td className="p-4">{cert.inspectionDate}</td>
                      <td className="p-4">{cert.expiryDate}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          cert.status === 'valid' ? 'bg-green-100 text-green-700' : 
                          cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-omega-blue hover:text-omega-yellow transition-colors flex items-center gap-1 font-bold text-xs uppercase">
                          <Download size={14} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
