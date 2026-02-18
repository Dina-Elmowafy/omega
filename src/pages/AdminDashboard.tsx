import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  FileText, 
  Users, 
  LogOut, 
  Plus, 
  Save, 
  Trash2,
  Edit2
} from 'lucide-react';
import Logo from '../components/Logo';

const AdminDashboard: React.FC = () => {
  const { companyInfo, updateCompanyInfo, services, updateServices } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'certificates'>('general');
  const [editingService, setEditingService] = useState<any | null>(null);

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingService) return;
    const { name, value } = e.target;
    setEditingService({
      ...editingService,
      [name]: value
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingService) return;
    const updatedFeatures = [...editingService.features];
    updatedFeatures[index] = value;
    setEditingService({
      ...editingService,
      features: updatedFeatures
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingService || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingService({
        ...editingService,
        image: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const saveService = async () => {
    if (!editingService) return;
    try {
      const isNewService = editingService.id && editingService.id.startsWith('new_');
      
      let updatedServices: any[];
      if (isNewService) {
        // خدمة جديدة: أضفها للقائمة
        updatedServices = [...services, editingService];
      } else {
        // خدمة موجودة: استبدلها فقط (استبدال مباشر بدون نسخ مزدوجة)
        updatedServices = services.map(s => s.id === editingService.id ? editingService : s);
      }
      
      // تأكد من عدم وجود نسخ مزدوجة بناءً على الـ ID
      const uniqueServices = Array.from(
        new Map(updatedServices.map(s => [s.id, s])).values()
      );
      
      await updateServices(uniqueServices);
      setEditingService(null);
      alert('Service saved successfully!');
    } catch (error) {
      alert('Error saving service: ' + error);
    }
  };

  const createNewService = () => {
    setEditingService({
      id: `new_${Date.now()}`,
      title: '',
      shortDescription: '',
      fullDescription: '',
      iconName: '',
      image: '',
      features: ['', '', '']
    });
  };

  const deleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      updateServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
           <Logo variant="light" className="scale-75 origin-left" />
           <p className="text-xs text-omega-yellow uppercase tracking-widest mt-4 ml-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold ${activeTab === 'general' ? 'bg-omega-blue' : 'hover:bg-gray-800'}`}>
            <Settings size={18} /> General Settings
          </button>
          <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold ${activeTab === 'services' ? 'bg-omega-blue' : 'hover:bg-gray-800'}`}>
            <FileText size={18} /> Manage Services
          </button>
          <button onClick={() => setActiveTab('certificates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold ${activeTab === 'certificates' ? 'bg-omega-blue' : 'hover:bg-gray-800'}`}>
            <Users size={18} /> Certificates
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded text-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 capitalize">{activeTab} Management</h1>

        {activeTab === 'general' && (
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl">
            <h3 className="font-bold text-lg mb-6 text-gray-700">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Company Slogan</label>
                <input name="slogan" value={companyInfo.slogan} onChange={handleInfoChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Phone Number</label>
                <input name="phone" value={companyInfo.phone} onChange={handleInfoChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Email Address</label>
                <input name="email" value={companyInfo.email} onChange={handleInfoChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-1">Address</label>
                <textarea name="address" value={companyInfo.address} onChange={handleInfoChange} className="w-full p-2 border rounded" rows={3} />
              </div>
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            {!editingService ? (
              <>
                <div className="flex justify-end">
                  <button onClick={createNewService} className="bg-omega-blue text-white px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-omega-blue/90 transition-colors">
                    <Plus size={16} /> Add New Service
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {services.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <img src={service.image} className="w-16 h-16 rounded object-cover" alt={service.title} />
                        <div>
                          <h4 className="font-bold text-lg">{service.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{service.shortDescription}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingService(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded font-bold"><Edit2 size={18} /></button>
                        <button onClick={() => deleteService(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-700">{editingService.id.startsWith('new_') ? 'Add New Service' : 'Edit Service'}</h3>
                  <button onClick={() => setEditingService(null)} className="text-gray-500 hover:text-gray-800 text-2xl">×</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">Service Title</label>
                      <input name="title" value={editingService.title} onChange={handleServiceChange} className="w-full p-2 border rounded" placeholder="e.g., Rope Access Services" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-1">Icon Name</label>
                      <input name="iconName" value={editingService.iconName} onChange={handleServiceChange} className="w-full p-2 border rounded" placeholder="e.g., Anchor" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Short Description</label>
                    <textarea name="shortDescription" value={editingService.shortDescription} onChange={handleServiceChange} className="w-full p-2 border rounded" rows={2} placeholder="Brief service description" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Full Description</label>
                    <textarea name="fullDescription" value={editingService.fullDescription} onChange={handleServiceChange} className="w-full p-2 border rounded" rows={4} placeholder="Detailed service description" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Upload Image</label>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Image Preview</label>
                      {editingService.image && (
                        <img src={editingService.image} alt="Preview" className="w-full h-32 rounded object-cover" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Key Features</label>
                    <div className="space-y-2">
                      {editingService.features.map((feature: string, i: number) => (
                        <input key={i} value={feature} onChange={(e) => handleFeatureChange(i, e.target.value)} className="w-full p-2 border rounded" placeholder={`Feature ${i + 1}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={saveService} className="px-6 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-2 hover:bg-green-700 transition-colors">
                      <Save size={16} /> Save Service
                    </button>
                    <button onClick={() => setEditingService(null)} className="px-6 py-2 bg-gray-400 text-white rounded font-bold hover:bg-gray-500 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;