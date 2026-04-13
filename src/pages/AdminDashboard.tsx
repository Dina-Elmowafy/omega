import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, FileText, Users, LogOut, Plus, Save, Trash2, Edit2, Search, Building2, Home, Info, X, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import { QRCodeCanvas } from 'qrcode.react';
import { api } from '../services/api';
import { HomePageContent, CompanyInfo, AboutPageContent } from '../types';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { companyInfo, updateCompanyInfo, homeContent, updateHomeContent, aboutContent, updateAboutContent, services, updateServices, certificates, refreshData } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'general' | 'home' | 'about' | 'services' | 'certificates'>('general');
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingCert, setEditingCert] = useState<any | null>(null); 
  const [isSavingCert, setIsSavingCert] = useState(false);
  
  const [localHomeContent, setLocalHomeContent] = useState<HomePageContent>(homeContent);
  const [localAboutContent, setLocalAboutContent] = useState<AboutPageContent>(aboutContent);
  const [localCompanyInfo, setLocalCompanyInfo] = useState<CompanyInfo>(companyInfo);

  useEffect(() => { if (homeContent && Object.keys(homeContent).length > 0) setLocalHomeContent(homeContent); }, [homeContent]);
  useEffect(() => { if (aboutContent && Object.keys(aboutContent).length > 0) setLocalAboutContent(aboutContent); }, [aboutContent]);
  useEffect(() => { if (companyInfo && Object.keys(companyInfo).length > 0) setLocalCompanyInfo(companyInfo); }, [companyInfo]);

  if (!user || user.role !== 'admin') { navigate('/login'); return null; }

  // === GENERAL ===
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalCompanyInfo({ ...localCompanyInfo, [e.target.name]: e.target.value }); };
  const saveCompanyInfo = async () => { try { await updateCompanyInfo(localCompanyInfo); toast.success("Saved!"); } catch (e) { toast.error("Error"); } };

  // === HOME PAGE ===
  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalHomeContent({ ...localHomeContent, [e.target.name]: e.target.value }); };
  const handleHomeImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => { if (e.target.files && e.target.files[0]) { const reader = new FileReader(); reader.onloadend = () => setLocalHomeContent({ ...localHomeContent, [field]: reader.result as string }); reader.readAsDataURL(e.target.files[0]); } };
  const handleStatChange = (index: number, field: string, value: string) => { const newStats = [...(localHomeContent.stats || [])]; newStats[index] = { ...newStats[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, stats: newStats }); };
  const handleIndustryChange = (index: number, field: string, value: string) => { const newInds = [...(localHomeContent.industries || [])]; newInds[index] = { ...newInds[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, industries: newInds }); };
  const handleIndustryImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const reader = new FileReader(); reader.onloadend = () => { const newInds = [...(localHomeContent.industries || [])]; newInds[index] = { ...newInds[index], image: reader.result as string }; setLocalHomeContent({ ...localHomeContent, industries: newInds }); }; reader.readAsDataURL(e.target.files[0]); } };
  const handleWhyChooseUsChange = (index: number, field: string, value: string) => { const newItems = [...(localHomeContent.whyChooseUsItems || [])]; newItems[index] = { ...newItems[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, whyChooseUsItems: newItems }); };
  const saveHomeContent = async () => { const btn = document.getElementById('save-home-btn'); const ogText = btn ? btn.innerText : ''; if (btn) btn.innerText = "Saving..."; try { await updateHomeContent(localHomeContent); toast.success("Home Page updated!"); } catch(e) { toast.error("Error"); } finally { if (btn) btn.innerText = ogText; } };

  // === ABOUT PAGE ===
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalAboutContent({ ...localAboutContent, [e.target.name]: e.target.value }); };
  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const reader = new FileReader(); reader.onloadend = () => setLocalAboutContent({ ...localAboutContent, coverImage: reader.result as string }); reader.readAsDataURL(e.target.files[0]); } };
  const saveAboutContent = async () => { const btn = document.getElementById('save-about-btn'); const ogText = btn ? btn.innerText : ''; if (btn) btn.innerText = "Saving..."; try { await updateAboutContent(localAboutContent); toast.success("About Page updated!"); } catch(e) { toast.error("Error"); } finally { if (btn) btn.innerText = ogText; } };

  // === SERVICES ===
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { if (editingService) setEditingService({ ...editingService, [e.target.name]: e.target.value }); };
  const handleFeatureChange = (index: number, value: string, isAr: boolean = false) => { 
    if (editingService) { 
        if(isAr) {
            const updatedFeaturesAr = [...(editingService.featuresAr || editingService.features.map(()=>''))]; 
            updatedFeaturesAr[index] = value; 
            setEditingService({ ...editingService, featuresAr: updatedFeaturesAr });
        } else {
            const updatedFeatures = [...(editingService.features || [])]; 
            updatedFeatures[index] = value; 
            setEditingService({ ...editingService, features: updatedFeatures });
        }
    } 
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (editingService && e.target.files && e.target.files[0]) { const reader = new FileReader(); reader.onloadend = () => setEditingService({ ...editingService, image: reader.result as string }); reader.readAsDataURL(e.target.files[0]); } };
  const saveService = async () => { if (!editingService) return; try { const isNew = editingService.id && String(editingService.id).startsWith('new_'); let updatedServices = isNew ? [...services, editingService] : services.map(s => s.id === editingService.id ? editingService : s); const uniqueServices = Array.from(new Map(updatedServices.map(s => [s.id, s])).values()); await updateServices(uniqueServices); setEditingService(null); toast.success('Saved!'); } catch (error) { toast.error('Error'); } };
  const createNewService = () => setEditingService({ id: `new_${Date.now()}`, title: '', titleAr: '', shortDescription: '', shortDescriptionAr: '', fullDescription: '', fullDescriptionAr: '', iconName: '', image: '', features: ['', '', ''], featuresAr: ['', '', ''] });
  const deleteService = (id: string) => { if (confirm('Delete?')) updateServices(services.filter(s => s.id !== id)); };

  // === CERTIFICATES ===
  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { if (editingCert) setEditingCert({ ...editingCert, [e.target.name]: e.target.value }); };
  
  const saveCertificate = async () => { 
    if (!editingCert) return; 
    
    // التأكد من إدخال الـ ID
    if (!editingCert.id || editingCert.id.trim() === '') {
      toast.error('Please enter a Certificate ID');
      return;
    }

    setIsSavingCert(true);
    
    try { 
      const today = new Date(); 
      const expDate = new Date(editingCert.expiryDate || today); 
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24)); 
      let status = 'valid'; 
      if (diffDays <= 0) status = 'expired'; 
      else if (diffDays <= 30) status = 'expiring'; 
      
      const finalCert = { 
        ...editingCert, 
        id: editingCert.id.trim(), 
        status, 
        equipmentStatus: editingCert.equipmentStatus || 'Accepted',
        companyName: editingCert.companyName || 'Unassigned / Others' 
      }; 
      
      await api.certificates.addOrUpdate(finalCert); 
      await refreshData(); 
      setEditingCert(null); 
      toast.success('Certificate Saved Successfully!'); 
    } catch (error: any) { 
      console.error(error);
      toast.error(`Error: ${error.message || 'Failed to save'}`); 
    } finally { 
      setIsSavingCert(false); 
    } 
  };
  
  const createNewCertificate = () => { 
    setEditingCert({ 
      id: '', 
      companyName: '', 
      equipmentName: '', 
      serialNumber: '', 
      inspectionDate: '', 
      expiryDate: '', 
      pdfUrl: '', // رابط نصي لجوجل درايف
      equipmentStatus: 'Accepted'
    }); 
  };
  
  const deleteCertificate = async (id: string) => { if (confirm('Delete?')) { try { await api.certificates.delete(id); await refreshData(); toast.success("Deleted"); } catch (error) { toast.error("Error deleting"); } } };

  const groupedCerts = certificates.reduce((acc, cert) => { const company = cert.companyName || 'Unassigned / Others'; if (!acc[company]) acc[company] = []; acc[company].push(cert); return acc; }, {} as Record<string, typeof certificates>);
  const sortedCompanies = Object.keys(groupedCerts).sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-800 bg-slate-900 sticky top-0"><Logo variant="light" className="scale-75 origin-left" /></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button type="button" onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Settings size={18} /> General Info</button>
          <button type="button" onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Home size={18} /> Home Page</button>
          <button type="button" onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'about' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Info size={18} /> About Us Page</button>
          <button type="button" onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'services' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><FileText size={18} /> Services</button>
          <button type="button" onClick={() => setActiveTab('certificates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'certificates' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Users size={18} /> Certificates</button>
        </nav>
        <div className="p-4 border-t border-gray-800 bg-slate-900 sticky bottom-0"><button type="button" onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold"><LogOut size={18} /> Logout</button></div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-8 capitalize">{activeTab} Management</h1>

        {/* === GENERAL TAB === */}
        {activeTab === 'general' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
            <h3 className="font-bold text-xl mb-6 border-b pb-4">Company Info</h3>
            <div className="space-y-5">
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Company Slogan</label><input name="slogan" value={localCompanyInfo.slogan || ''} onChange={handleInfoChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label><input name="phone" value={localCompanyInfo.phone || ''} onChange={handleInfoChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Email</label><input name="email" value={localCompanyInfo.email || ''} onChange={handleInfoChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
              <div><label className="block text-sm font-bold text-gray-600 mb-1">Address</label><textarea name="address" value={localCompanyInfo.address || ''} onChange={handleInfoChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={3} /></div>
              <button type="button" onClick={saveCompanyInfo} className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"><Save size={18} /> Save</button>
            </div>
          </div>
        )}

        {/* === HOME TAB === */}
        {activeTab === 'home' && localHomeContent && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
            <h3 className="font-bold text-xl mb-6 border-b pb-4">Home Page Content</h3>
            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-lg mb-4 text-omega-blue">Hero Section</h4>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div><label className="block text-sm font-bold mb-1">Title (EN)</label><textarea name="heroTitle" value={localHomeContent.heroTitle || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" rows={2}/></div>
                  <div><label className="block text-sm font-bold mb-1">Title (AR)</label><textarea name="heroTitleAr" value={localHomeContent.heroTitleAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none text-right" dir="rtl" rows={2}/></div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div><label className="block text-sm font-bold mb-1">Highlighted Word (EN)</label><input name="heroHighlight" value={localHomeContent.heroHighlight || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
                  <div><label className="block text-sm font-bold mb-1">Highlighted Word (AR)</label><input name="heroHighlightAr" value={localHomeContent.heroHighlightAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none text-right" dir="rtl" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div><label className="block text-sm font-bold mb-1">Subtitle (EN)</label><input name="heroSubtitle" value={localHomeContent.heroSubtitle || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none" /></div>
                  <div><label className="block text-sm font-bold mb-1">Subtitle (AR)</label><input name="heroSubtitleAr" value={localHomeContent.heroSubtitleAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg outline-none text-right" dir="rtl" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Background Image</label><input type="file" accept="image/*" onChange={(e) => handleHomeImageUpload(e, 'heroImage')} className="w-full p-2 border border-dashed rounded-lg" /></div>
                  <div>{localHomeContent.heroImage && <img src={localHomeContent.heroImage} alt="Preview" className="w-full h-24 rounded-lg object-cover" />}</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4 text-omega-blue">Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  {localHomeContent.stats?.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border grid grid-cols-1 gap-2">
                      <input value={stat.val} onChange={(e) => handleStatChange(idx, 'val', e.target.value)} className="w-full p-2 font-bold text-center border rounded" placeholder="Value (e.g. 150+)" />
                      <div className="flex gap-2">
                        <input value={stat.label} onChange={(e) => handleStatChange(idx, 'label', e.target.value)} className="w-full p-2 text-xs text-center border rounded" placeholder="Label (EN)" />
                        <input value={stat.labelAr || ''} onChange={(e) => handleStatChange(idx, 'labelAr', e.target.value)} className="w-full p-2 text-xs text-center border rounded text-right" dir="rtl" placeholder="Label (AR)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4 text-omega-blue">Industries We Serve</h4>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div><input name="industriesTitle" value={localHomeContent.industriesTitle || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg" placeholder="Section Title (EN)" /></div>
                  <div><input name="industriesTitleAr" value={localHomeContent.industriesTitleAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" placeholder="Section Title (AR)" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div><input name="industriesSubtitle" value={localHomeContent.industriesSubtitle || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg" placeholder="Subtitle (EN)" /></div>
                  <div><input name="industriesSubtitleAr" value={localHomeContent.industriesSubtitleAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" placeholder="Subtitle (AR)" /></div>
                </div>
                
                <div className="space-y-4">
                  {localHomeContent.industries?.map((ind, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border flex gap-4">
                      <div className="w-32 shrink-0">{ind.image ? <img src={ind.image} className="w-full h-24 object-cover rounded mb-2" /> : <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>}
                        <input type="file" accept="image/*" onChange={(e) => handleIndustryImageUpload(idx, e)} className="w-full text-[10px]" />
                      </div>
                      <div className="w-full grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <input value={ind.title} onChange={(e) => handleIndustryChange(idx, 'title', e.target.value)} className="w-full p-2 text-sm font-bold border rounded" placeholder="Title (EN)" />
                          <textarea value={ind.description} onChange={(e) => handleIndustryChange(idx, 'description', e.target.value)} className="w-full p-2 text-sm border rounded" rows={2} placeholder="Description (EN)" />
                        </div>
                        <div className="space-y-2">
                          <input value={ind.titleAr || ''} onChange={(e) => handleIndustryChange(idx, 'titleAr', e.target.value)} className="w-full p-2 text-sm font-bold border rounded text-right" dir="rtl" placeholder="Title (AR)" />
                          <textarea value={ind.descriptionAr || ''} onChange={(e) => handleIndustryChange(idx, 'descriptionAr', e.target.value)} className="w-full p-2 text-sm border rounded text-right" dir="rtl" rows={2} placeholder="Description (AR)" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold text-lg mb-4 text-omega-blue">Why Choose Us</h4>
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div><input name="whyChooseUsTitle" value={localHomeContent.whyChooseUsTitle || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg" placeholder="Section Title (EN)" /></div>
                    <div><input name="whyChooseUsTitleAr" value={localHomeContent.whyChooseUsTitleAr || ''} onChange={handleHomeChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" placeholder="Section Title (AR)" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div><label className="block text-sm font-bold mb-2">Upload Image</label><input type="file" accept="image/*" onChange={(e) => handleHomeImageUpload(e, 'whyChooseUsImage')} className="w-full p-2 border border-dashed rounded-lg" /></div>
                  <div>{localHomeContent.whyChooseUsImage && <img src={localHomeContent.whyChooseUsImage} alt="Preview" className="w-full h-24 rounded-lg object-cover" />}</div>
                </div>
                <div className="space-y-4">
                  {localHomeContent.whyChooseUsItems?.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input value={item.title} onChange={(e) => handleWhyChooseUsChange(idx, 'title', e.target.value)} className="w-full p-2 font-bold border rounded" placeholder="Title (EN)" />
                        <input value={item.description} onChange={(e) => handleWhyChooseUsChange(idx, 'description', e.target.value)} className="w-full p-2 text-sm border rounded" placeholder="Description (EN)" />
                      </div>
                      <div className="space-y-2">
                        <input value={item.titleAr || ''} onChange={(e) => handleWhyChooseUsChange(idx, 'titleAr', e.target.value)} className="w-full p-2 font-bold border rounded text-right" dir="rtl" placeholder="Title (AR)" />
                        <input value={item.descriptionAr || ''} onChange={(e) => handleWhyChooseUsChange(idx, 'descriptionAr', e.target.value)} className="w-full p-2 text-sm border rounded text-right" dir="rtl" placeholder="Description (AR)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" id="save-home-btn" onClick={saveHomeContent} className="mt-8 w-full py-3 bg-omega-blue text-white rounded-lg font-bold"><Save size={18} className="inline mr-2" /> Save Home Page</button>
            </div>
          </div>
        )}

        {/* === ABOUT TAB === */}
        {activeTab === 'about' && localAboutContent && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
            <h3 className="font-bold text-xl mb-6 border-b pb-4">About Us Page Content</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold mb-2">Main Title (EN)</label><input name="title" value={localAboutContent.title || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg" /></div>
                <div><label className="block text-sm font-bold mb-2">Main Title (AR)</label><input name="titleAr" value={localAboutContent.titleAr || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold mb-2">Subtitle (EN)</label><input name="subtitle" value={localAboutContent.subtitle || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg" /></div>
                <div><label className="block text-sm font-bold mb-2">Subtitle (AR)</label><input name="subtitleAr" value={localAboutContent.subtitleAr || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Cover Image</label><input type="file" accept="image/*" onChange={handleAboutImageUpload} className="w-full p-2 border border-dashed rounded-lg bg-gray-50" /></div>
                  <div><label className="block text-sm font-bold mb-2">Preview</label>{localAboutContent.coverImage && <img src={localAboutContent.coverImage} className="w-full h-24 rounded-lg object-cover" />}</div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Our Story (EN)</label><textarea name="story" value={localAboutContent.story || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg" rows={4} /></div>
                  <div><label className="block text-sm font-bold mb-2">Our Story (AR)</label><textarea name="storyAr" value={localAboutContent.storyAr || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" rows={4} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Our Mission (EN)</label><textarea name="mission" value={localAboutContent.mission || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg" rows={3} /></div>
                  <div><label className="block text-sm font-bold mb-2">Our Mission (AR)</label><textarea name="missionAr" value={localAboutContent.missionAr || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" rows={3} /></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-bold mb-2">Our Vision (EN)</label><textarea name="vision" value={localAboutContent.vision || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg" rows={3} /></div>
                  <div><label className="block text-sm font-bold mb-2">Our Vision (AR)</label><textarea name="visionAr" value={localAboutContent.visionAr || ''} onChange={handleAboutChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" rows={3} /></div>
              </div>
              <button type="button" id="save-about-btn" onClick={saveAboutContent} className="mt-8 w-full py-3 bg-omega-blue text-white rounded-lg font-bold"><Save size={18} className="inline mr-2" /> Save About Page</button>
            </div>
          </div>
        )}

        {/* === SERVICES TAB === */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {!editingService ? (
              <>
                <div className="flex justify-end"><button type="button" onClick={createNewService} className="bg-omega-blue text-white px-6 py-3 rounded-full font-bold flex items-center gap-2"><Plus size={18} /> Add New Service</button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-between">
                      <div><img src={service.image} className="w-full h-40 rounded-lg object-cover mb-4" alt={service.title} /><h4 className="font-bold text-lg mb-2">{service.title}</h4></div>
                      <div className="flex gap-2 mt-6 pt-4 border-t"><button type="button" onClick={() => setEditingService(service)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-bold flex justify-center items-center gap-2"><Edit2 size={16} /> Edit</button><button type="button" onClick={() => deleteService(service.id)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingService.id.startsWith('new_') ? 'Create Service' : 'Edit Service'}</h3><button type="button" onClick={() => setEditingService(null)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button></div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Title (EN)</label><input name="title" value={editingService.title || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg" /></div>
                    <div><label className="block text-sm font-bold mb-2">Title (AR)</label><input name="titleAr" value={editingService.titleAr || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" /></div>
                  </div>
                  <div><label className="block text-sm font-bold mb-2">Icon (Lucide)</label><input name="iconName" value={editingService.iconName || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg" /></div>
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold mb-2">Short Desc (EN)</label><textarea name="shortDescription" value={editingService.shortDescription || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg" rows={2} /></div>
                      <div><label className="block text-sm font-bold mb-2">Short Desc (AR)</label><textarea name="shortDescriptionAr" value={editingService.shortDescriptionAr || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" rows={2} /></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold mb-2">Full Desc (EN)</label><textarea name="fullDescription" value={editingService.fullDescription || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg" rows={4} /></div>
                      <div><label className="block text-sm font-bold mb-2">Full Desc (AR)</label><textarea name="fullDescriptionAr" value={editingService.fullDescriptionAr || ''} onChange={handleServiceChange} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" rows={4} /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Cover Image</label><input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-2 border border-dashed rounded-lg" /></div>
                    <div>{editingService.image && <img src={editingService.image} alt="Preview" className="w-full h-32 rounded-lg object-cover" />}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-3">Features (EN)</label>
                      <div className="space-y-3">{editingService.features?.map((f: string, i: number) => (<input key={i} value={f} onChange={(e) => handleFeatureChange(i, e.target.value, false)} className="w-full p-3 bg-gray-50 border rounded-lg" placeholder={`Feature EN ${i + 1}`} />))}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-right">Features (AR)</label>
                      <div className="space-y-3">{(editingService.featuresAr || ['', '', '']).map((f: string, i: number) => (<input key={i} value={f} onChange={(e) => handleFeatureChange(i, e.target.value, true)} className="w-full p-3 bg-gray-50 border rounded-lg text-right" dir="rtl" placeholder={`Feature AR ${i + 1}`} />))}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-8 border-t"><button type="button" onClick={saveService} className="flex-1 py-3 bg-omega-blue text-white rounded-lg font-bold"><Save size={18} className="inline mr-2"/> Save</button><button type="button" onClick={() => setEditingService(null)} className="px-8 py-3 bg-gray-200 rounded-lg font-bold">Cancel</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === CERTIFICATES TAB === */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {!editingCert ? (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-white"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-3 bg-gray-50 border rounded-full text-sm w-80" /></div><button type="button" onClick={createNewCertificate} className="bg-omega-blue text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"><Plus size={16}/> New Certificate</button></div>
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b"><th className="p-5">Equipment</th><th className="p-5">Serial</th><th className="p-5">Expiry</th><th className="p-5">Status</th><th className="p-5 text-center">QR</th><th className="p-5 text-right">Action</th></tr></thead>
                  <tbody className="text-sm text-gray-700">
                    {sortedCompanies.map((company) => (
                      <React.Fragment key={company}>
                        <tr className="bg-slate-100/50 border-y"><td colSpan={6} className="px-5 py-4 font-bold text-omega-dark"><div className="flex items-center gap-2"><Building2 size={20} className="text-omega-yellow" /><span>{company}</span></div></td></tr>
                        {groupedCerts[company].map((cert) => (
                          <tr key={cert.id} className="hover:bg-blue-50/30 border-b">
                              <td className="p-5 font-bold">{cert.equipmentName}</td>
                              <td className="p-5 font-mono text-xs">{cert.serialNumber}</td>
                              <td className="p-5">{cert.expiryDate}</td>
                              <td className="p-5"><span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-gray-100">{cert.status}</span></td>
                              <td className="p-5 flex justify-center text-center"><QRCodeCanvas value={`${window.location.origin}/#/certificate/${cert.id}`} size={512} style={{ width: '48px', height: '48px' }} level={"H"} /></td>
                              <td className="p-5 text-right"><button type="button" onClick={() => deleteCertificate(cert.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingCert.id ? 'Edit Certificate' : 'New Certificate'}</h3><button type="button" onClick={() => setEditingCert(null)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button></div>
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Certificate ID (رقم الشهادة)</label>
                      <input name="id" value={editingCert.id || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg font-mono text-blue-700 bg-blue-50 focus:outline-none focus:border-blue-400" placeholder="e.g. C-12345" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Company Name</label>
                      <input name="companyName" value={editingCert.companyName || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Equipment</label><input name="equipmentName" value={editingCert.equipmentName || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" /></div>
                    <div><label className="block text-sm font-bold mb-2">Serial</label><input name="serialNumber" value={editingCert.serialNumber || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg font-mono" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Inspection Date</label><input type="date" name="inspectionDate" value={editingCert.inspectionDate || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" /></div>
                    <div><label className="block text-sm font-bold mb-2">Expiry Date</label><input type="date" name="expiryDate" value={editingCert.expiryDate || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" /></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Equipment Status (حالة المعدة)</label>
                      <select name="equipmentStatus" value={editingCert.equipmentStatus || 'Accepted'} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 outline-none">
                        <option value="Accepted">Accepted (مقبولة)</option>
                        <option value="Rejected">Rejected (مرفوضة)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">PDF Link (Google Drive)</label>
                      <input type="url" name="pdfUrl" value={editingCert.pdfUrl || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-omega-yellow" placeholder="https://drive.google.com/..." />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8 border-t">
                    <button type="button" onClick={saveCertificate} disabled={isSavingCert} className="flex-1 py-3 bg-omega-dark text-white rounded-lg font-bold flex justify-center items-center disabled:opacity-70 transition-all">
                      {isSavingCert ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : <><Save size={18} className="inline mr-2"/> Save Certificate</>}
                    </button>
                    <button type="button" onClick={() => setEditingCert(null)} disabled={isSavingCert} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold disabled:opacity-50 transition-colors">Cancel</button>
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