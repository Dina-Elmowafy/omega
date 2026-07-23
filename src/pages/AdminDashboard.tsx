import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, FileText, Shield, Users, LogOut, Plus, Save, Trash2, Edit2, Search, Home, Info, X, Loader2, Folder } from 'lucide-react';
import Logo from '../components/Logo';
import ImageEditor from '../components/ImageEditor';
import { QRCodeCanvas } from 'qrcode.react';
import { api } from '../services/api';
import { HomePageContent, CompanyInfo, AboutPageContent } from '../types';
import toast from 'react-hot-toast';

type FormFieldProps = {
  label: string;
  name: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const FormField: React.FC<FormFieldProps> = ({ label, name, value, type = 'text', disabled = false, onChange }) => (
  <div>
    <label className="block text-sm font-bold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-3 border rounded-lg text-slate-900 bg-white"
    />
  </div>
);

const AdminDashboard: React.FC = () => {
  const { companyInfo, updateCompanyInfo, homeContent, updateHomeContent, aboutContent, updateAboutContent, services, updateServices, certificates, newCertificates, newLicenses, licenses, deletedCertificates, deletedLicenses, refreshData } = useData();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'general' | 'home' | 'about' | 'services' | 'certificates' | 'newCertificates' | 'licenses' | 'newLicenses' | 'trash'>('general');
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editingCert, setEditingCert] = useState<any | null>(null); 
  const [editingNewCert, setEditingNewCert] = useState<any | null>(null);
  const [editingNewLicense, setEditingNewLicense] = useState<any | null>(null);
  const [editingLicense, setEditingLicense] = useState<any | null>(null);
  const [isSavingCert, setIsSavingCert] = useState(false);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [imageEditorSource, setImageEditorSource] = useState('');
  const [imageEditorCallback, setImageEditorCallback] = useState<((img: string) => void) | null>(null);
  
  const [localHomeContent, setLocalHomeContent] = useState<HomePageContent>(homeContent);
  const [localAboutContent, setLocalAboutContent] = useState<AboutPageContent>(aboutContent);
  const [localCompanyInfo, setLocalCompanyInfo] = useState<CompanyInfo>(companyInfo);
  const [certificateSearch, setCertificateSearch] = useState('');
  const [licenseSearch, setLicenseSearch] = useState('');
  const [newCertificateSearch, setNewCertificateSearch] = useState('');
  const [newLicenseSearch, setNewLicenseSearch] = useState('');
  const [selectedCertificateCompany, setSelectedCertificateCompany] = useState<string | null>(null);
  const [selectedLicenseCompany, setSelectedLicenseCompany] = useState<string | null>(null);
  const [selectedNewCertificateCompany, setSelectedNewCertificateCompany] = useState<string | null>(null);
  const [selectedNewLicenseCompany, setSelectedNewLicenseCompany] = useState<string | null>(null);
  const [manualCertificateCompanies, setManualCertificateCompanies] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('manual_certificate_companies') || '[]'); } catch { return []; }
  });
  const [manualLicenseCompanies, setManualLicenseCompanies] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('manual_license_companies') || '[]'); } catch { return []; }
  });
  const [manualNewCertificateCompanies, setManualNewCertificateCompanies] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('manual_new_certificate_companies') || '[]'); } catch { return []; } });
  const [manualNewLicenseCompanies, setManualNewLicenseCompanies] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('manual_new_license_companies') || '[]'); } catch { return []; } });

  useEffect(() => { if (homeContent && Object.keys(homeContent).length > 0) setLocalHomeContent(homeContent); }, [homeContent]);
  useEffect(() => { if (aboutContent && Object.keys(aboutContent).length > 0) setLocalAboutContent(aboutContent); }, [aboutContent]);
  useEffect(() => { if (companyInfo && Object.keys(companyInfo).length > 0) setLocalCompanyInfo(companyInfo); }, [companyInfo]);
  useEffect(() => { localStorage.setItem('manual_certificate_companies', JSON.stringify(manualCertificateCompanies)); }, [manualCertificateCompanies]);
  useEffect(() => { localStorage.setItem('manual_license_companies', JSON.stringify(manualLicenseCompanies)); }, [manualLicenseCompanies]);
  useEffect(() => { localStorage.setItem('manual_new_certificate_companies', JSON.stringify(manualNewCertificateCompanies)); }, [manualNewCertificateCompanies]);
  useEffect(() => { localStorage.setItem('manual_new_license_companies', JSON.stringify(manualNewLicenseCompanies)); }, [manualNewLicenseCompanies]);

  if (!user || user.role !== 'admin') { navigate('/login'); return null; }

  // === IMAGE EDITOR ===
  const openImageEditor = (callback: (img: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImageEditorSource(result);
          setImageEditorCallback(() => callback);
          setImageEditorOpen(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // === GENERAL ===
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalCompanyInfo({ ...localCompanyInfo, [e.target.name]: e.target.value }); };
  const saveCompanyInfo = async () => { try { await updateCompanyInfo(localCompanyInfo); toast.success("Saved!"); } catch (e) { toast.error("Error"); } };

  // === HOME PAGE ===
  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalHomeContent({ ...localHomeContent, [e.target.name]: e.target.value }); };
  const handleHomeImageUpload = (field: string) => { 
    openImageEditor((croppedImage) => {
      setLocalHomeContent({ ...localHomeContent, [field]: croppedImage });
      setImageEditorOpen(false);
      toast.success('Image edited successfully!');
    });
  };
  const handleStatChange = (index: number, field: string, value: string) => { const newStats = [...(localHomeContent.stats || [])]; newStats[index] = { ...newStats[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, stats: newStats }); };
  const handleIndustryChange = (index: number, field: string, value: string) => { const newInds = [...(localHomeContent.industries || [])]; newInds[index] = { ...newInds[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, industries: newInds }); };
  const handleIndustryImageUpload = (index: number) => { 
    openImageEditor((croppedImage) => {
      const newInds = [...(localHomeContent.industries || [])]; 
      newInds[index] = { ...newInds[index], image: croppedImage }; 
      setLocalHomeContent({ ...localHomeContent, industries: newInds }); 
    });
  };
  const handleWhyChooseUsChange = (index: number, field: string, value: string) => { const newItems = [...(localHomeContent.whyChooseUsItems || [])]; newItems[index] = { ...newItems[index], [field]: value }; setLocalHomeContent({ ...localHomeContent, whyChooseUsItems: newItems }); };
  const saveHomeContent = async () => { const btn = document.getElementById('save-home-btn'); const ogText = btn ? btn.innerText : ''; if (btn) btn.innerText = "Saving..."; try { await updateHomeContent(localHomeContent); toast.success("Home Page updated!"); } catch(e) { toast.error("Error"); } finally { if (btn) btn.innerText = ogText; } };

  // === ABOUT PAGE ===
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setLocalAboutContent({ ...localAboutContent, [e.target.name]: e.target.value }); };
  const handleAboutImageUpload = () => { 
    openImageEditor((croppedImage) => {
      setLocalAboutContent({ ...localAboutContent, coverImage: croppedImage });
    });
  };
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
  const addFeature = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        features: [...(editingService.features || []), ''],
        featuresAr: [...(editingService.featuresAr || []), '']
      });
    }
  };
  const removeFeature = (index: number) => {
    if (editingService) {
      const updatedFeatures = (editingService.features || []).filter((_: string, i: number) => i !== index);
      const updatedFeaturesAr = (editingService.featuresAr || []).filter((_: string, i: number) => i !== index);
      setEditingService({
        ...editingService,
        features: updatedFeatures,
        featuresAr: updatedFeaturesAr
      });
    }
  };
  const handleImageUpload = () => { 
    openImageEditor((croppedImage) => {
      if (editingService) {
        setEditingService({ ...editingService, image: croppedImage });
      }
    });
  };
  const saveService = async () => { if (!editingService) return; try { const isNew = editingService.id && String(editingService.id).startsWith('new_'); let updatedServices = isNew ? [...services, editingService] : services.map(s => s.id === editingService.id ? editingService : s); const uniqueServices = Array.from(new Map(updatedServices.map(s => [s.id, s])).values()); await updateServices(uniqueServices); setEditingService(null); toast.success('Saved!'); } catch (error) { toast.error('Error'); } };
  const createNewService = () => setEditingService({ id: `new_${Date.now()}`, title: '', titleAr: '', shortDescription: '', shortDescriptionAr: '', fullDescription: '', fullDescriptionAr: '', iconName: '', image: '', features: ['', ''], featuresAr: ['', ''] });
  const deleteService = (id: string) => { if (confirm('Delete?')) updateServices(services.filter(s => s.id !== id)); };

  // === CERTIFICATES ===
  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingCert) return;
    setEditingCert({
      ...editingCert,
      [e.target.name]: e.target.value,
      ...(e.target.name === 'status' ? { statusManuallySet: true } : {})
    });
  };
  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingLicense) return;
    setEditingLicense({
      ...editingLicense,
      [e.target.name]: e.target.value,
      ...(e.target.name === 'status' ? { statusManuallySet: true } : {})
    });
  };
  const handleNewCertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingNewCert) return;
    setEditingNewCert({ ...editingNewCert, [e.target.name]: e.target.value, ...(e.target.name === 'status' ? { statusManuallySet: true } : {}) });
  };
  const handleNewLicenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingNewLicense) return;
    setEditingNewLicense({ ...editingNewLicense, [e.target.name]: e.target.value, ...(e.target.name === 'status' ? { statusManuallySet: true } : {}) });
  };
  const handleLicensePhotoUpload = () => {
    if (!editingLicense) return;
    openImageEditor((croppedImage) => {
      setEditingLicense({ ...editingLicense, licenseOwnerPhotoUrl: croppedImage });
      setImageEditorOpen(false);
    });
  };

  const saveCertificate = async () => { 
    if (!editingCert) return; 
    
    // Ensure the certificate ID is provided.
    if (!editingCert.id || editingCert.id.trim() === '') {
      toast.error('Please enter a Certificate ID');
      return;
    }

    setIsSavingCert(true);
    
    try { 
      let status = editingCert.status || 'valid';
      
      // If the admin did not set a status manually, calculate it from the expiry date.
      if (!editingCert.statusManuallySet) {
        const today = new Date(); 
        const expDate = new Date(editingCert.expiryDate || today); 
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24)); 
        status = 'valid'; 
        if (diffDays <= 0) status = 'expired'; 
        else if (diffDays <= 30) status = 'expiring';
      }
      
      const { originalId, ...certificateData } = editingCert;
      const finalCert = { 
        ...certificateData, 
        id: editingCert.id.trim(), 
        barcodeId: editingCert.barcodeId || editingCert.id.trim(),
        status, 
        statusManuallySet: Boolean(editingCert.statusManuallySet),
        equipmentStatus: editingCert.equipmentStatus || 'Accepted',
        companyName: editingCert.companyName || 'Unassigned / Others' 
      }; 
      
      await api.certificates.addOrUpdate(finalCert); 
      if (originalId && originalId !== finalCert.id) await api.certificates.delete(originalId);
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

  const saveLicense = async () => {
    if (!editingLicense) return;
    setIsSavingCert(true);
    try {
      const { originalId, ...licenseData } = editingLicense;
      const finalLicense = {
        ...licenseData,
        id: editingLicense.id?.trim() || `license-${Date.now()}`,
        barcodeId: editingLicense.barcodeId || editingLicense.id?.trim() || `license-${Date.now()}`,
        statusManuallySet: Boolean(editingLicense.statusManuallySet),
        companyName: editingLicense.companyName || 'Unassigned / Others'
      };
      await api.licenses.addOrUpdate(finalLicense);
      if (originalId && originalId !== finalLicense.id) await api.licenses.delete(originalId);
      await refreshData();
      setEditingLicense(null);
      toast.success('License Saved Successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message || 'Failed to save license'}`);
    } finally {
      setIsSavingCert(false);
    }
  };

  const saveNewCertificate = async () => {
    if (!editingNewCert?.id?.trim()) { toast.error('Please enter a Certificate ID'); return; }
    setIsSavingCert(true);
    try {
      const { originalId, ...newCertificateData } = editingNewCert;
      const finalRecord = { ...newCertificateData, id: editingNewCert.id.trim(), barcodeId: editingNewCert.barcodeId || editingNewCert.id.trim(), companyName: editingNewCert.companyName || 'Unassigned / Others', equipmentStatus: editingNewCert.equipmentStatus || 'Accepted', status: editingNewCert.status || 'valid', statusManuallySet: Boolean(editingNewCert.statusManuallySet) };
      await api.newCertificates.addOrUpdate(finalRecord);
      if (originalId && originalId !== finalRecord.id) await api.newCertificates.delete(originalId);
      await refreshData(); setEditingNewCert(null); toast.success('New certificate saved successfully!');
    } catch (error: any) { toast.error(`Error: ${error.message || 'Failed to save'}`); }
    finally { setIsSavingCert(false); }
  };
  const saveNewLicense = async () => {
    if (!editingNewLicense?.id?.trim()) { toast.error('Please enter a Certificate ID'); return; }
    setIsSavingCert(true);
    try {
      const { originalId, ...licenseData } = editingNewLicense;
      const finalRecord = { ...licenseData, id: editingNewLicense.id.trim(), barcodeId: editingNewLicense.barcodeId || editingNewLicense.id.trim(), companyName: editingNewLicense.companyName || 'Unassigned / Others', status: editingNewLicense.status || 'valid', statusManuallySet: Boolean(editingNewLicense.statusManuallySet) };
      await api.newLicenses.addOrUpdate(finalRecord);
      if (originalId && originalId !== finalRecord.id) await api.newLicenses.delete(originalId);
      await refreshData(); setEditingNewLicense(null); toast.success('New license saved successfully!');
    } catch (error: any) { toast.error(`Error: ${error.message || 'Failed to save'}`); } finally { setIsSavingCert(false); }
  };

  const createNewLicense = (companyName = '') => { 
    setEditingLicense({ 
      id: '',
      companyName, 
      equipmentName: '', 
      model: '',
      serialNumber: '', 
      inspectionDate: '', 
      expiryDate: '', 
      pdfUrl: '', 
      status: 'valid',
      licenseOwnerName: '',
      licenseOwnerPhotoUrl: ''
    }); 
  };

  const createNewCertificate = (companyName = '') => { 
    setEditingCert({ 
      id: '', 
      companyName, 
      equipmentName: '', 
      model: '',
      serialNumber: '', 
      inspectionDate: '', 
      expiryDate: '', 
      pdfUrl: '', 
      equipmentStatus: 'Accepted',
      status: 'valid',
      licenseOwnerName: '',
      licenseOwnerPhotoUrl: ''
    }); 
  };
  const createNewVehicleLicense = (companyName = '') => setEditingNewLicense({ id: '', companyName, personName: '', drivingLicenseNumber: '', plateNumber: '', chassisNumber: '', inspectionDate: '', expiryDate: '', status: 'valid', pdfUrl: '' });
  const createCertificateInCompanyFolder = () => {
    if (selectedCertificateCompany) {
      createNewCertificate(selectedCertificateCompany);
      return;
    }

    const companyName = normalizeCompanyFolderName(window.prompt('Company name for the new folder'));
    if (!companyName) return;

    setManualCertificateCompanies((current) => current.includes(companyName) ? current : [...current, companyName]);
    setSelectedCertificateCompany(companyName);
  };
  const createLicenseInCompanyFolder = () => {
    if (selectedLicenseCompany) {
      createNewLicense(selectedLicenseCompany);
      return;
    }

    const companyName = normalizeCompanyFolderName(window.prompt('Company name for the new folder'));
    if (!companyName) return;

    setManualLicenseCompanies((current) => current.includes(companyName) ? current : [...current, companyName]);
    setSelectedLicenseCompany(companyName);
  };
  
  const deleteCertificate = async (id: string) => { if (confirm('Delete?')) { try { await api.certificates.delete(id); await refreshData(); toast.success("Deleted"); } catch (error) { toast.error("Error deleting"); } } };
  const deleteLicense = async (id: string) => { if (confirm('Delete?')) { try { await api.licenses.delete(id); await refreshData(); toast.success("Deleted"); } catch (error) { toast.error("Error deleting"); } } };
  const deleteNewCertificate = async (id: string) => { if (confirm('Delete?')) { try { await api.newCertificates.delete(id); await refreshData(); toast.success('Deleted'); } catch { toast.error('Error deleting'); } } };
  const deleteNewLicense = async (id: string) => { if (confirm('Delete?')) { try { await api.newLicenses.delete(id); await refreshData(); toast.success('Deleted'); } catch { toast.error('Error deleting'); } } };
  const restoreCertificate = async (id: string) => { try { await api.certificates.restore(id); await refreshData(); toast.success("Certificate restored"); } catch (error) { toast.error("Error restoring certificate"); } };
  const restoreLicense = async (id: string) => { try { await api.licenses.restore(id); await refreshData(); toast.success("License restored"); } catch (error) { toast.error("Error restoring license"); } };
  const permanentDeleteCertificate = async (id: string) => {
    if (!confirm('Permanently delete this certificate? This cannot be undone.')) return;
    try {
      await api.certificates.permanentDelete(id);
      await refreshData();
      toast.success('Certificate permanently deleted');
    } catch (error) {
      toast.error('Error deleting certificate');
    }
  };
  const permanentDeleteLicense = async (id: string) => {
    if (!confirm('Permanently delete this license? This cannot be undone.')) return;
    try {
      await api.licenses.permanentDelete(id);
      await refreshData();
      toast.success('License permanently deleted');
    } catch (error) {
      toast.error('Error deleting license');
    }
  };

  const matchesSearch = (item: Record<string, unknown>, search: string) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    return [
      item.companyName,
      item.equipmentName,
      item.model,
      item.serialNumber,
      item.id,
      item.licenseOwnerName,
      item.personName,
      item.drivingLicenseNumber,
      item.vehicleType,
      item.brand,
      item.plateNumber,
      item.chassisNumber,
      item.inspectionDate,
      item.expiryDate,
      item.status,
      item.equipmentStatus
    ].some(value => String(value || '').toLowerCase().includes(query));
  };

  const visibleCertificates = certificates.filter(cert => matchesSearch(cert as unknown as Record<string, unknown>, certificateSearch));
  const visibleLicenses = licenses.filter(license => matchesSearch(license as unknown as Record<string, unknown>, licenseSearch));
  const visibleNewCertificates = newCertificates.filter(cert => matchesSearch(cert as unknown as Record<string, unknown>, newCertificateSearch));
  const visibleNewLicenses = newLicenses.filter(license => matchesSearch(license as unknown as Record<string, unknown>, newLicenseSearch));

  const normalizeCompanyFolderName = (name?: string | null) => {
    const cleaned = String(name || '').trim().replace(/\s+/g, ' ');
    if (!cleaned) return 'Unassigned / Others';
    return cleaned.replace(/\s*\d+$/, '').trim() || cleaned;
  };

  const groupedCerts = visibleCertificates.reduce((acc, cert) => { const company = normalizeCompanyFolderName(cert.companyName); if (!acc[company]) acc[company] = []; acc[company].push(cert); return acc; }, {} as Record<string, typeof visibleCertificates>);
  const certificateCompanyNames = Array.from(new Set([
    ...Object.keys(groupedCerts),
    ...manualCertificateCompanies.map(normalizeCompanyFolderName).filter((company) => !certificateSearch.trim() || company.toLowerCase().includes(certificateSearch.toLowerCase().trim()))
  ]));
  const sortedCompanies = certificateCompanyNames.sort((a, b) => a.localeCompare(b));
  const groupedLicenses = visibleLicenses.reduce((acc, license) => { const company = normalizeCompanyFolderName(license.companyName); if (!acc[company]) acc[company] = []; acc[company].push(license); return acc; }, {} as Record<string, typeof visibleLicenses>);
  const licenseCompanyNames = Array.from(new Set([
    ...Object.keys(groupedLicenses),
    ...manualLicenseCompanies.map(normalizeCompanyFolderName).filter((company) => !licenseSearch.trim() || company.toLowerCase().includes(licenseSearch.toLowerCase().trim()))
  ]));
  const sortedLicenseCompanies = licenseCompanyNames.sort((a, b) => a.localeCompare(b));
  const selectedCertificateRecords = selectedCertificateCompany ? groupedCerts[selectedCertificateCompany] || [] : [];
  const selectedLicenseRecords = selectedLicenseCompany ? groupedLicenses[selectedLicenseCompany] || [] : [];
  const groupedNewCertificates = visibleNewCertificates.reduce((acc, cert) => { const company = normalizeCompanyFolderName(cert.companyName); if (!acc[company]) acc[company] = []; acc[company].push(cert); return acc; }, {} as Record<string, typeof visibleNewCertificates>);
  const newCertificateCompanies = Array.from(new Set([...Object.keys(groupedNewCertificates), ...manualNewCertificateCompanies.map(normalizeCompanyFolderName).filter((company) => !newCertificateSearch.trim() || company.toLowerCase().includes(newCertificateSearch.toLowerCase().trim()))])).sort((a, b) => a.localeCompare(b));
  const selectedNewCertificateRecords = selectedNewCertificateCompany ? groupedNewCertificates[selectedNewCertificateCompany] || [] : [];
  const groupedNewLicenses = visibleNewLicenses.reduce((acc, license) => { const company = normalizeCompanyFolderName(license.companyName); if (!acc[company]) acc[company] = []; acc[company].push(license); return acc; }, {} as Record<string, typeof visibleNewLicenses>);
  const newLicenseCompanies = Array.from(new Set([...Object.keys(groupedNewLicenses), ...manualNewLicenseCompanies.map(normalizeCompanyFolderName).filter((company) => !newLicenseSearch.trim() || company.toLowerCase().includes(newLicenseSearch.toLowerCase().trim()))])).sort((a, b) => a.localeCompare(b));
  const selectedNewLicenseRecords = selectedNewLicenseCompany ? groupedNewLicenses[selectedNewLicenseCompany] || [] : [];

  const createNewCertificateInCompanyFolder = () => {
    if (selectedNewCertificateCompany) { setEditingNewCert({ id: '', companyName: selectedNewCertificateCompany, vehicleType: '', brand: '', model: '', plateNumber: '', chassisNumber: '', inspectionDate: '', expiryDate: '', equipmentStatus: 'Accepted', status: 'valid', pdfUrl: '' }); return; }
    const company = normalizeCompanyFolderName(window.prompt('Company name for the new folder'));
    if (!company) return;
    setManualNewCertificateCompanies((items) => items.includes(company) ? items : [...items, company]); setSelectedNewCertificateCompany(company);
  };
  const createNewLicenseInCompanyFolder = () => {
    if (selectedNewLicenseCompany) { createNewVehicleLicense(selectedNewLicenseCompany); return; }
    const company = normalizeCompanyFolderName(window.prompt('Company name for the new folder'));
    if (!company) return;
    setManualNewLicenseCompanies((items) => items.includes(company) ? items : [...items, company]); setSelectedNewLicenseCompany(company);
  };

  const renameCertificateFolder = async (company: string) => {
    const newCompanyName = normalizeCompanyFolderName(window.prompt('New folder name', company));
    if (!newCompanyName || newCompanyName === company) return;

    const folderRecords = certificates.filter((cert) => normalizeCompanyFolderName(cert.companyName) === company);
    try {
      for (const cert of folderRecords) {
        await api.certificates.addOrUpdate({ ...cert, companyName: newCompanyName });
      }
      setManualCertificateCompanies((current) => Array.from(new Set([
        ...current.filter((name) => normalizeCompanyFolderName(name) !== company),
        newCompanyName
      ])));
      if (selectedCertificateCompany === company) setSelectedCertificateCompany(newCompanyName);
      await refreshData();
      toast.success('Folder renamed');
    } catch (error) {
      toast.error('Error renaming folder');
    }
  };

  const renameLicenseFolder = async (company: string) => {
    const newCompanyName = normalizeCompanyFolderName(window.prompt('New folder name', company));
    if (!newCompanyName || newCompanyName === company) return;

    const folderRecords = licenses.filter((license) => normalizeCompanyFolderName(license.companyName) === company);
    try {
      for (const license of folderRecords) {
        await api.licenses.addOrUpdate({ ...license, companyName: newCompanyName });
      }
      setManualLicenseCompanies((current) => Array.from(new Set([
        ...current.filter((name) => normalizeCompanyFolderName(name) !== company),
        newCompanyName
      ])));
      if (selectedLicenseCompany === company) setSelectedLicenseCompany(newCompanyName);
      await refreshData();
      toast.success('Folder renamed');
    } catch (error) {
      toast.error('Error renaming folder');
    }
  };

  const deleteCertificateFolder = async (company: string) => {
    const folderRecords = certificates.filter((cert) => normalizeCompanyFolderName(cert.companyName) === company);
    const message = folderRecords.length > 0
      ? `Delete "${company}" folder and move ${folderRecords.length} certificate(s) to Trash?`
      : `Delete empty "${company}" folder?`;
    if (!confirm(message)) return;

    try {
      for (const cert of folderRecords) {
        await api.certificates.delete(cert.id);
      }
      setManualCertificateCompanies((current) => current.filter((name) => normalizeCompanyFolderName(name) !== company));
      if (selectedCertificateCompany === company) setSelectedCertificateCompany(null);
      await refreshData();
      toast.success('Folder deleted');
    } catch (error) {
      toast.error('Error deleting folder');
    }
  };

  const deleteLicenseFolder = async (company: string) => {
    const folderRecords = licenses.filter((license) => normalizeCompanyFolderName(license.companyName) === company);
    const message = folderRecords.length > 0
      ? `Delete "${company}" folder and move ${folderRecords.length} license(s) to Trash?`
      : `Delete empty "${company}" folder?`;
    if (!confirm(message)) return;

    try {
      for (const license of folderRecords) {
        await api.licenses.delete(license.id);
      }
      setManualLicenseCompanies((current) => current.filter((name) => normalizeCompanyFolderName(name) !== company));
      if (selectedLicenseCompany === company) setSelectedLicenseCompany(null);
      await refreshData();
      toast.success('Folder deleted');
    } catch (error) {
      toast.error('Error deleting folder');
    }
  };

  const renameNewCertificateFolder = async (company: string) => {
    const newCompanyName = normalizeCompanyFolderName(window.prompt('New folder name', company));
    if (!newCompanyName || newCompanyName === company) return;

    try {
      for (const cert of newCertificates.filter((item) => normalizeCompanyFolderName(item.companyName) === company)) {
        await api.newCertificates.addOrUpdate({ ...cert, companyName: newCompanyName });
      }
      setManualNewCertificateCompanies((current) => Array.from(new Set([...current.filter((name) => normalizeCompanyFolderName(name) !== company), newCompanyName])));
      if (selectedNewCertificateCompany === company) setSelectedNewCertificateCompany(newCompanyName);
      await refreshData();
      toast.success('Folder renamed');
    } catch {
      toast.error('Error renaming folder');
    }
  };

  const deleteNewCertificateFolder = async (company: string) => {
    const folderRecords = newCertificates.filter((item) => normalizeCompanyFolderName(item.companyName) === company);
    if (!confirm(folderRecords.length ? `Delete "${company}" folder and its ${folderRecords.length} certificate(s)?` : `Delete empty "${company}" folder?`)) return;

    try {
      for (const cert of folderRecords) await api.newCertificates.delete(cert.id);
      setManualNewCertificateCompanies((current) => current.filter((name) => normalizeCompanyFolderName(name) !== company));
      if (selectedNewCertificateCompany === company) setSelectedNewCertificateCompany(null);
      await refreshData();
      toast.success('Folder deleted');
    } catch {
      toast.error('Error deleting folder');
    }
  };

  const renameNewLicenseFolder = async (company: string) => {
    const newCompanyName = normalizeCompanyFolderName(window.prompt('New folder name', company));
    if (!newCompanyName || newCompanyName === company) return;

    try {
      for (const license of newLicenses.filter((item) => normalizeCompanyFolderName(item.companyName) === company)) {
        await api.newLicenses.addOrUpdate({ ...license, companyName: newCompanyName });
      }
      setManualNewLicenseCompanies((current) => Array.from(new Set([...current.filter((name) => normalizeCompanyFolderName(name) !== company), newCompanyName])));
      if (selectedNewLicenseCompany === company) setSelectedNewLicenseCompany(newCompanyName);
      await refreshData();
      toast.success('Folder renamed');
    } catch {
      toast.error('Error renaming folder');
    }
  };

  const deleteNewLicenseFolder = async (company: string) => {
    const folderRecords = newLicenses.filter((item) => normalizeCompanyFolderName(item.companyName) === company);
    if (!confirm(folderRecords.length ? `Delete "${company}" folder and its ${folderRecords.length} license(s)?` : `Delete empty "${company}" folder?`)) return;

    try {
      for (const license of folderRecords) await api.newLicenses.delete(license.id);
      setManualNewLicenseCompanies((current) => current.filter((name) => normalizeCompanyFolderName(name) !== company));
      if (selectedNewLicenseCompany === company) setSelectedNewLicenseCompany(null);
      await refreshData();
      toast.success('Folder deleted');
    } catch {
      toast.error('Error deleting folder');
    }
  };

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
          <button type="button" onClick={() => setActiveTab('newCertificates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'newCertificates' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><FileText size={18} /> New Certificates</button>
          <button type="button" onClick={() => setActiveTab('licenses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'licenses' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Shield size={18} /> Licenses</button>
          <button type="button" onClick={() => setActiveTab('newLicenses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'newLicenses' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Shield size={18} /> New Licenses</button>
          <button type="button" onClick={() => setActiveTab('trash')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'trash' ? 'bg-omega-blue shadow-lg' : 'hover:bg-gray-800'}`}><Trash2 size={18} /> Trash</button>
        </nav>
        <div className="p-4 border-t border-gray-800 bg-slate-900 sticky bottom-0"><button type="button" onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-bold"><LogOut size={18} /> Logout</button></div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-8 capitalize">{activeTab} Management</h1>

        {activeTab === 'trash' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-omega-dark">Recycle Bin</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b font-bold">Deleted Certificates</div>
                {deletedCertificates.length === 0 ? (
                  <p className="p-5 text-sm text-gray-500">No deleted certificates.</p>
                ) : (
                  <div className="divide-y">
                    {deletedCertificates.map((cert) => (
                      <div key={cert.id} className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold">{cert.equipmentName || cert.id}</p>
                          <p className="text-xs text-gray-500">{cert.companyName || 'Unassigned / Others'}</p>
                          <p className="text-xs text-gray-400">Deleted: {cert.deletedAt || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => restoreCertificate(cert.id)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Restore</button>
                          <button type="button" onClick={() => permanentDeleteCertificate(cert.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Delete forever</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b font-bold">Deleted Licenses</div>
                {deletedLicenses.length === 0 ? (
                  <p className="p-5 text-sm text-gray-500">No deleted licenses.</p>
                ) : (
                  <div className="divide-y">
                    {deletedLicenses.map((license) => (
                      <div key={license.id} className="p-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold">{license.equipmentName || license.id}</p>
                          <p className="text-xs text-gray-500">{license.companyName || 'Unassigned / Others'}</p>
                          <p className="text-xs text-gray-400">Deleted: {license.deletedAt || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => restoreLicense(license.id)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Restore</button>
                          <button type="button" onClick={() => permanentDeleteLicense(license.id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold">Delete forever</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                  <div><label className="block text-sm font-bold mb-2">Background Image</label><button type="button" onClick={() => handleHomeImageUpload('heroImage')} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-omega-blue hover:bg-blue-50 transition">Click to select & edit image</button></div>
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
                        <button type="button" onClick={() => handleIndustryImageUpload(idx)} className="w-full p-2 border border-dashed border-gray-300 rounded text-xs hover:border-omega-blue hover:bg-blue-50 transition">Edit image</button>
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
                  <div><label className="block text-sm font-bold mb-2">Upload Image</label><button type="button" onClick={() => handleHomeImageUpload('whyChooseUsImage')} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-omega-blue hover:bg-blue-50 transition">Click to select & edit image</button></div>
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
                  <div><label className="block text-sm font-bold mb-2">Cover Image</label><button type="button" onClick={handleAboutImageUpload} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-omega-blue hover:bg-blue-50 transition">Click to select & edit image</button></div>
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
                    <div><label className="block text-sm font-bold mb-2">Cover Image</label><button type="button" onClick={handleImageUpload} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-omega-blue hover:bg-blue-50 transition">Click to select & edit image</button></div>
                    <div>{editingService.image && <img src={editingService.image} alt="Preview" className="w-full h-32 rounded-lg object-cover" />}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-3">Features (EN)</label>
                      <div className="space-y-3">
                        {editingService.features?.map((f: string, i: number) => (
                          <div key={i} className="flex gap-2">
                            <input 
                              value={f} 
                              onChange={(e) => handleFeatureChange(i, e.target.value, false)} 
                              className="flex-1 p-3 bg-gray-50 border rounded-lg" 
                              placeholder={`Feature EN ${i + 1}`} 
                            />
                            {editingService.features.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeFeature(i)} 
                                className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={addFeature} 
                        className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100"
                      >
                        <Plus size={16} /> Add Feature
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-right">Features (AR)</label>
                      <div className="space-y-3">
                        {(editingService.featuresAr || []).map((f: string, i: number) => (
                          <div key={i} className="flex gap-2">
                            <input 
                              value={f} 
                              onChange={(e) => handleFeatureChange(i, e.target.value, true)} 
                              className="flex-1 p-3 bg-gray-50 border rounded-lg text-right" 
                              dir="rtl" 
                              placeholder={`Feature AR ${i + 1}`} 
                            />
                            {(editingService.featuresAr || []).length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => removeFeature(i)} 
                                className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button" 
                        onClick={addFeature} 
                        className="mt-3 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100"
                      >
                        <Plus size={16} /> Add Feature
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-8 border-t"><button type="button" onClick={saveService} className="flex-1 py-3 bg-omega-blue text-white rounded-lg font-bold"><Save size={18} className="inline mr-2"/> Save</button><button type="button" onClick={() => setEditingService(null)} className="px-8 py-3 bg-gray-200 rounded-lg font-bold">Cancel</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === LICENSES TAB === */}
        {activeTab === 'licenses' && (
          <div className="space-y-6">
            {!editingLicense ? (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search licenses..." value={licenseSearch} onChange={(event) => setLicenseSearch(event.target.value)} className="pl-10 pr-4 py-3 bg-gray-50 border rounded-full text-sm w-80" />
                  </div>
                  <button type="button" onClick={createLicenseInCompanyFolder} className="bg-omega-blue text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"><Plus size={16}/> New License</button>
                </div>
                {!selectedLicenseCompany ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 bg-gray-50">
                    {sortedLicenseCompanies.map((company) => (
                      <div
                        key={company}
                        className="group bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-omega-blue hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <button type="button" onClick={() => setSelectedLicenseCompany(company)} className="flex items-center gap-3 min-w-0 text-left flex-1">
                            <Folder size={34} className="text-omega-yellow shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-omega-dark truncate">{company}</p>
                              <p className="text-xs text-gray-500 mt-1">{(groupedLicenses[company] || []).length} licenses inside</p>
                            </div>
                          </button>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => setSelectedLicenseCompany(company)} className="text-xs font-bold text-omega-blue opacity-0 group-hover:opacity-100 transition-opacity">Open</button>
                            <button type="button" onClick={() => renameLicenseFolder(company)} className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Rename ${company} license folder`} title="Rename folder"><Edit2 size={16} /></button>
                            <button type="button" onClick={() => deleteLicenseFolder(company)} className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${company} license folder`} title="Delete folder"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between gap-4">
                      <div>
                        <button type="button" onClick={() => setSelectedLicenseCompany(null)} className="text-sm font-bold text-omega-blue hover:underline">Back to companies</button>
                        <h3 className="text-xl font-bold text-omega-dark mt-1">{selectedLicenseCompany}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{selectedLicenseRecords.length} Licenses</span>
                        <button type="button" onClick={createLicenseInCompanyFolder} className="bg-omega-blue text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Plus size={14}/> New License in this company</button>
                      </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b"><th className="p-5">Company Name</th><th className="p-5">Owner Name</th><th className="p-5">Equipment</th><th className="p-5">Model</th><th className="p-5">Serial</th><th className="p-5">Inspection</th><th className="p-5">Expiry</th><th className="p-5">Status</th><th className="p-5">QR</th><th className="p-5 text-right">Edit</th></tr></thead>
                      <tbody className="text-sm text-gray-700">
                        {selectedLicenseRecords.map((license) => (
                          <tr key={license.id} className="hover:bg-blue-50/30 border-b">
                            <td className="p-5">{license.companyName || '-'}</td>
                            <td className="p-5">{license.licenseOwnerName || '-'}</td>
                            <td className="p-5 font-bold">{license.equipmentName}</td>
                            <td className="p-5">{license.model || '-'}</td>
                            <td className="p-5 font-mono text-xs">{license.serialNumber}</td>
                            <td className="p-5">{license.inspectionDate || '-'}</td>
                            <td className="p-5">{license.expiryDate}</td>
                            <td className="p-5"><span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                              license.status === 'expired' ? 'bg-red-100 text-red-700' :
                              license.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>{license.status}</span></td>
                            <td className="p-5">
                              <div className="inline-flex items-center justify-center rounded-xl bg-white p-1 shadow-sm">
                                <QRCodeCanvas value={`${window.location.origin}/#/license/${license.barcodeId || license.id}`} size={64} level="H" />
                              </div>
                            </td>
                            <td className="p-5 text-right flex justify-end gap-3">
                              <button type="button" onClick={() => setEditingLicense({ ...license, barcodeId: license.barcodeId || license.id, originalId: license.id })} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                              <button type="button" onClick={() => deleteLicense(license.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingLicense.id ? 'Edit License' : 'New License'}</h3><button type="button" onClick={() => setEditingLicense(null)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button></div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Company Name</label>
                      <input name="companyName" value={editingLicense.companyName || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Owner Name</label>
                      <input type="text" name="licenseOwnerName" value={editingLicense.licenseOwnerName || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" placeholder="Owner name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Equipment</label>
                      <input name="equipmentName" value={editingLicense.equipmentName || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Model</label>
                      <input name="model" value={editingLicense.model || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Serial</label>
                      <input name="serialNumber" value={editingLicense.serialNumber || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Inspection Date</label>
                      <input type="date" name="inspectionDate" value={editingLicense.inspectionDate || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Expiry Date</label>
                      <input type="date" name="expiryDate" value={editingLicense.expiryDate || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">License Status</label>
                    <select name="status" value={editingLicense.status || 'valid'} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 outline-none">
                      <option value="valid">Valid</option>
                      <option value="expiring">Expiring Soon</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">PDF Link</label>
                    <input type="url" name="pdfUrl" value={editingLicense.pdfUrl || ''} onChange={handleLicenseChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-omega-yellow" placeholder="https://drive.google.com/..." />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">License Owner Photo</label>
                    <div className="flex gap-3 items-center">
                      <button type="button" onClick={handleLicensePhotoUpload} disabled={isSavingCert} className="px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
                        Upload Photo
                      </button>
                      {editingLicense.licenseOwnerPhotoUrl && (
                        <img src={editingLicense.licenseOwnerPhotoUrl} alt="Owner" className="w-16 h-16 rounded-full object-cover border" />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8 border-t">
                    <button type="button" onClick={saveLicense} disabled={isSavingCert} className="flex-1 py-3 bg-omega-dark text-white rounded-lg font-bold flex justify-center items-center disabled:opacity-70 transition-all">
                      {isSavingCert ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : <><Save size={18} className="inline mr-2"/> Save License</>}
                    </button>
                    <button type="button" onClick={() => setEditingLicense(null)} disabled={isSavingCert} className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold disabled:opacity-50 transition-colors">Cancel</button>
                  </div>
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
                <div className="p-6 border-b flex justify-between items-center bg-white"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search certificates..." value={certificateSearch} onChange={(event) => setCertificateSearch(event.target.value)} className="pl-10 pr-4 py-3 bg-gray-50 border rounded-full text-sm w-80" /></div><button type="button" onClick={createCertificateInCompanyFolder} className="bg-omega-blue text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"><Plus size={16}/> New Certificate</button></div>
                {!selectedCertificateCompany ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 bg-gray-50">
                    {sortedCompanies.map((company) => (
                      <div
                        key={company}
                        className="group bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-omega-blue hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <button type="button" onClick={() => setSelectedCertificateCompany(company)} className="flex items-center gap-3 min-w-0 text-left flex-1">
                            <Folder size={34} className="text-omega-yellow shrink-0" />
                            <div className="min-w-0">
                              <p className="font-bold text-omega-dark truncate">{company}</p>
                              <p className="text-xs text-gray-500 mt-1">{(groupedCerts[company] || []).length} certificates inside</p>
                            </div>
                          </button>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => setSelectedCertificateCompany(company)} className="text-xs font-bold text-omega-blue opacity-0 group-hover:opacity-100 transition-opacity">Open</button>
                            <button type="button" onClick={() => renameCertificateFolder(company)} className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Rename ${company} certificate folder`} title="Rename folder"><Edit2 size={16} /></button>
                            <button type="button" onClick={() => deleteCertificateFolder(company)} className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${company} certificate folder`} title="Delete folder"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between gap-4">
                      <div>
                        <button type="button" onClick={() => setSelectedCertificateCompany(null)} className="text-sm font-bold text-omega-blue hover:underline">Back to companies</button>
                        <h3 className="text-xl font-bold text-omega-dark mt-1">{selectedCertificateCompany}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{selectedCertificateRecords.length} Certificates</span>
                        <button type="button" onClick={createCertificateInCompanyFolder} className="bg-omega-blue text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Plus size={14}/> New Certificate in this company</button>
                      </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b"><th className="p-5">Company Name</th><th className="p-5">ID</th><th className="p-5">Equipment</th><th className="p-5">Model</th><th className="p-5">Serial</th><th className="p-5">Inspection</th><th className="p-5">Expiry</th><th className="p-5">Certificate Status</th><th className="p-5">Equipment Status</th><th className="p-5 text-center">QR</th><th className="p-5 text-right">Edit</th></tr></thead>
                      <tbody className="text-sm text-gray-700">
                        {selectedCertificateRecords.map((cert) => (
                          <tr key={cert.id} className="hover:bg-blue-50/30 border-b">
                              <td className="p-5">{cert.companyName || '-'}</td>
                              <td className="p-5 font-mono text-xs">{cert.id || '-'}</td>
                              <td className="p-5 font-bold">{cert.equipmentName}</td>
                              <td className="p-5">{cert.model || '-'}</td>
                              <td className="p-5 font-mono text-xs">{cert.serialNumber}</td>
                              <td className="p-5">{cert.inspectionDate || '-'}</td>
                              <td className="p-5">{cert.expiryDate}</td>
                              <td className="p-5"><span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                                cert.status === 'expired' ? 'bg-red-100 text-red-700' :
                                cert.status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>{cert.status}</span></td>
                              <td className="p-5">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                                  cert.equipmentStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>{cert.equipmentStatus || 'Accepted'}</span>
                              </td>
                              <td className="p-5 flex justify-center text-center"><QRCodeCanvas value={`${window.location.origin}/#/certificate/${cert.barcodeId || cert.id}`} size={512} style={{ width: '48px', height: '48px' }} level={"H"} /></td>
                              <td className="p-5 text-right flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setEditingCert({ ...cert, barcodeId: cert.barcodeId || cert.id, originalId: cert.id })} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                                <button type="button" onClick={() => deleteCertificate(cert.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                              </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingCert.id ? 'Edit Certificate' : 'New Certificate'}</h3><button type="button" onClick={() => setEditingCert(null)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button></div>
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Company Name</label>
                      <input name="companyName" value={editingCert.companyName || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Certificate ID</label>
                      <input name="id" value={editingCert.id || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg font-mono text-blue-700 bg-blue-50 focus:outline-none focus:border-blue-400" placeholder="e.g. C-12345" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Equipment</label><input name="equipmentName" value={editingCert.equipmentName || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" /></div>
                    <div><label className="block text-sm font-bold mb-2">Model</label><input name="model" value={editingCert.model || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">Serial</label><input name="serialNumber" value={editingCert.serialNumber || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg font-mono" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Inspection Date</label>
                      <input type="date" name="inspectionDate" value={editingCert.inspectionDate || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg" />
                    </div>
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
                      <label className="block text-sm font-bold mb-2">Certificate Status (حالة الشهادة)</label>
                      <select name="status" value={editingCert.status || 'valid'} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 outline-none">
                        <option value="valid">Valid (سارية)</option>
                        <option value="expiring">Expiring Soon (تنتهي قريبًا)</option>
                        <option value="expired">Expired (منتهية الصلاحية)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2">PDF Link (Google Drive)</label>
                    <input type="url" name="pdfUrl" value={editingCert.pdfUrl || ''} onChange={handleCertChange} disabled={isSavingCert} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-omega-yellow" placeholder="https://drive.google.com/..." />
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
        {activeTab === 'newCertificates' && (
          <div className="space-y-6">
            {!editingNewCert ? (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search new certificates..." value={newCertificateSearch} onChange={(event) => setNewCertificateSearch(event.target.value)} className="w-full sm:w-80 pl-10 pr-4 py-3 bg-gray-50 border rounded-full text-sm" /></div><button type="button" onClick={createNewCertificateInCompanyFolder} className="bg-omega-blue text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2"><Plus size={16}/> New Certificate</button></div>
                {!selectedNewCertificateCompany ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 bg-gray-50">{newCertificateCompanies.map((company) => <div key={company} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-omega-blue hover:shadow-md transition-all"><div className="flex items-start justify-between gap-4"><button type="button" onClick={() => setSelectedNewCertificateCompany(company)} className="flex items-center gap-3 min-w-0 text-left flex-1"><Folder size={34} className="text-omega-yellow shrink-0" /><div className="min-w-0"><p className="font-bold text-omega-dark truncate">{company}</p><p className="text-xs text-gray-500 mt-1">{(groupedNewCertificates[company] || []).length} certificates inside</p></div></button><div className="flex items-center gap-2 shrink-0"><button type="button" onClick={() => setSelectedNewCertificateCompany(company)} className="text-xs font-bold text-omega-blue opacity-0 group-hover:opacity-100 transition-opacity">Open</button><button type="button" onClick={() => renameNewCertificateFolder(company)} className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Rename ${company} new certificate folder`} title="Rename folder"><Edit2 size={16} /></button><button type="button" onClick={() => deleteNewCertificateFolder(company)} className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${company} new certificate folder`} title="Delete folder"><Trash2 size={16} /></button></div></div></div>)}</div> : <><div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between gap-4"><div><button type="button" onClick={() => setSelectedNewCertificateCompany(null)} className="text-sm font-bold text-omega-blue hover:underline">Back to companies</button><h3 className="text-xl font-bold text-omega-dark mt-1">{selectedNewCertificateCompany}</h3></div><div className="flex items-center gap-3"><span className="text-xs text-gray-500 uppercase tracking-wide">{selectedNewCertificateRecords.length} Certificates</span><button type="button" onClick={createNewCertificateInCompanyFolder} className="bg-omega-blue text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Plus size={14}/> New Certificate in this company</button></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-xs uppercase"><th className="p-4">ID</th><th className="p-4">Vehicle</th><th className="p-4">Brand / Model</th><th className="p-4">Plate</th><th className="p-4">QR</th><th className="p-4" /></tr></thead><tbody>{selectedNewCertificateRecords.map((cert) => <tr key={cert.id} className="border-t"><td className="p-4 font-mono">{cert.id}</td><td className="p-4">{cert.vehicleType}</td><td className="p-4">{cert.brand} {cert.model}</td><td className="p-4">{cert.plateNumber}</td><td className="p-4"><QRCodeCanvas value={`${window.location.origin}/#/new-certificate/${cert.barcodeId || cert.id}`} size={48} level="H" /></td><td className="p-4 flex gap-3"><button type="button" onClick={() => setEditingNewCert({ ...cert, barcodeId: cert.barcodeId || cert.id, originalId: cert.id })} className="text-blue-500"><Edit2 size={16}/></button><button type="button" onClick={() => deleteNewCertificate(cert.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></div></>}
                {!newCertificateCompanies.length && <p className="p-8 text-center text-gray-500">No new certificates yet.</p>}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border max-w-3xl mx-auto"><div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingNewCert.id ? 'Edit New Certificate' : 'New Certificate'}</h3><button type="button" onClick={() => setEditingNewCert(null)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button></div><div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5"><FormField label="Company Name / اسم الشركة" name="companyName" value={editingNewCert.companyName} onChange={handleNewCertChange} disabled={isSavingCert} /><FormField label="Certificate ID / رقم الشهادة" name="id" value={editingNewCert.id} onChange={handleNewCertChange} disabled={isSavingCert} /></div>
                <div className="grid md:grid-cols-2 gap-5"><FormField label="Vehicle Type / نوع المركبة" name="vehicleType" value={editingNewCert.vehicleType} onChange={handleNewCertChange} disabled={isSavingCert} /><FormField label="Brand / الماركة" name="brand" value={editingNewCert.brand} onChange={handleNewCertChange} disabled={isSavingCert} /></div>
                <div className="grid md:grid-cols-2 gap-5"><FormField label="Model / الموديل" name="model" value={editingNewCert.model} onChange={handleNewCertChange} disabled={isSavingCert} /><FormField label="Plate Number / رقم اللوحات" name="plateNumber" value={editingNewCert.plateNumber} onChange={handleNewCertChange} disabled={isSavingCert} /></div>
                <FormField label="Chassis Number / رقم الشاسيه" name="chassisNumber" value={editingNewCert.chassisNumber} onChange={handleNewCertChange} disabled={isSavingCert} />
                <div className="grid md:grid-cols-2 gap-5"><FormField label="Inspection Date" name="inspectionDate" type="date" value={editingNewCert.inspectionDate} onChange={handleNewCertChange} disabled={isSavingCert} /><FormField label="Expiry Date" name="expiryDate" type="date" value={editingNewCert.expiryDate} onChange={handleNewCertChange} disabled={isSavingCert} /></div>
                <div className="grid md:grid-cols-2 gap-5"><div><label className="block text-sm font-bold mb-2">Acceptance / مقبولة؟</label><select name="equipmentStatus" value={editingNewCert.equipmentStatus} onChange={handleNewCertChange} className="w-full p-3 border rounded-lg"><option value="Accepted">Accepted / مقبولة</option><option value="Rejected">Rejected / مرفوضة</option></select></div><div><label className="block text-sm font-bold mb-2">Validity / سارية؟</label><select name="status" value={editingNewCert.status} onChange={handleNewCertChange} className="w-full p-3 border rounded-lg"><option value="valid">Valid / سارية</option><option value="expiring">Expiring Soon / تنتهي قريباً</option><option value="expired">Expired / منتهية</option></select></div></div>
                <FormField label="PDF / Image Link" name="pdfUrl" value={editingNewCert.pdfUrl} type="url" onChange={handleNewCertChange} disabled={isSavingCert} />
                <div className="flex gap-4 pt-6 border-t"><button type="button" onClick={saveNewCertificate} disabled={isSavingCert} className="flex-1 py-3 bg-omega-dark text-white rounded-lg font-bold">{isSavingCert ? 'Saving...' : 'Save Certificate'}</button><button type="button" onClick={() => setEditingNewCert(null)} className="px-8 py-3 bg-gray-200 rounded-lg font-bold">Cancel</button></div>
              </div></div>
            )}
          </div>
        )}
        {activeTab === 'newLicenses' && (
          <div className="space-y-6">
            {!editingNewLicense ? <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Search new licenses..." value={newLicenseSearch} onChange={(event) => setNewLicenseSearch(event.target.value)} className="w-full sm:w-80 pl-10 pr-4 py-3 bg-gray-50 border rounded-full text-sm" /></div><button type="button" onClick={createNewLicenseInCompanyFolder} className="bg-omega-blue text-white px-6 py-3 rounded-full text-sm font-bold flex gap-2"><Plus size={16}/> New License</button></div>
              {!selectedNewLicenseCompany ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 bg-gray-50">{newLicenseCompanies.map((company) => <div key={company} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-omega-blue hover:shadow-md transition-all"><div className="flex items-start justify-between gap-4"><button type="button" onClick={() => setSelectedNewLicenseCompany(company)} className="flex items-center gap-3 min-w-0 text-left flex-1"><Folder size={34} className="text-omega-yellow shrink-0" /><div className="min-w-0"><p className="font-bold text-omega-dark truncate">{company}</p><p className="text-xs text-gray-500 mt-1">{(groupedNewLicenses[company] || []).length} licenses inside</p></div></button><div className="flex items-center gap-2 shrink-0"><button type="button" onClick={() => setSelectedNewLicenseCompany(company)} className="text-xs font-bold text-omega-blue opacity-0 group-hover:opacity-100 transition-opacity">Open</button><button type="button" onClick={() => renameNewLicenseFolder(company)} className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-700" aria-label={`Rename ${company} new license folder`} title="Rename folder"><Edit2 size={16} /></button><button type="button" onClick={() => deleteNewLicenseFolder(company)} className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${company} new license folder`} title="Delete folder"><Trash2 size={16} /></button></div></div></div>)}</div> : <><div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between gap-4"><div><button type="button" onClick={() => setSelectedNewLicenseCompany(null)} className="text-sm font-bold text-omega-blue hover:underline">Back to companies</button><h3 className="text-xl font-bold text-omega-dark mt-1">{selectedNewLicenseCompany}</h3></div><div className="flex items-center gap-3"><span className="text-xs text-gray-500 uppercase tracking-wide">{selectedNewLicenseRecords.length} Licenses</span><button type="button" onClick={createNewLicenseInCompanyFolder} className="bg-omega-blue text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"><Plus size={14}/> New License in this company</button></div></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-xs uppercase"><th className="p-4">Certificate ID</th><th className="p-4">Person</th><th className="p-4">Driving License</th><th className="p-4">Plate</th><th className="p-4">QR</th><th className="p-4" /></tr></thead><tbody>{selectedNewLicenseRecords.map((license) => <tr key={license.id} className="border-t"><td className="p-4 font-mono">{license.id}</td><td className="p-4">{license.personName}</td><td className="p-4 font-mono">{license.drivingLicenseNumber}</td><td className="p-4">{license.plateNumber}</td><td className="p-4"><QRCodeCanvas value={`${window.location.origin}/#/new-license/${license.barcodeId || license.id}`} size={48} level="H" /></td><td className="p-4 flex gap-3"><button type="button" onClick={() => setEditingNewLicense({ ...license, barcodeId: license.barcodeId || license.id, originalId: license.id })} className="text-blue-500"><Edit2 size={16}/></button><button type="button" onClick={() => deleteNewLicense(license.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></div></>}
              {!newLicenseCompanies.length && <p className="p-8 text-center text-gray-500">No new licenses yet.</p>}
            </div> : <div className="bg-white p-8 rounded-xl shadow-sm border max-w-3xl mx-auto"><div className="flex justify-between items-center mb-8 border-b pb-4"><h3 className="font-bold text-xl">{editingNewLicense.id ? 'Edit New License' : 'New License'}</h3><button type="button" onClick={() => setEditingNewLicense(null)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button></div><div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5"><FormField label="Company Name / اسم الشركة" name="companyName" value={editingNewLicense.companyName} onChange={handleNewLicenseChange} disabled={isSavingCert} /><FormField label="Certificate ID / رقم الشهادة" name="id" value={editingNewLicense.id} onChange={handleNewLicenseChange} disabled={isSavingCert} /></div>
              <div className="grid md:grid-cols-2 gap-5"><FormField label="Person Name / اسم الشخص" name="personName" value={editingNewLicense.personName} onChange={handleNewLicenseChange} disabled={isSavingCert} /><FormField label="Driving License Number / رقم رخصة القيادة" name="drivingLicenseNumber" value={editingNewLicense.drivingLicenseNumber} onChange={handleNewLicenseChange} disabled={isSavingCert} /></div>
              <div className="grid md:grid-cols-2 gap-5"><FormField label="Vehicle Plate Number / رقم اللوحات" name="plateNumber" value={editingNewLicense.plateNumber} onChange={handleNewLicenseChange} disabled={isSavingCert} /><FormField label="Chassis Number / رقم الشاسيه" name="chassisNumber" value={editingNewLicense.chassisNumber} onChange={handleNewLicenseChange} disabled={isSavingCert} /></div>
              <div className="grid md:grid-cols-2 gap-5"><FormField label="Inspection Date" name="inspectionDate" type="date" value={editingNewLicense.inspectionDate} onChange={handleNewLicenseChange} disabled={isSavingCert} /><FormField label="Expiry Date" name="expiryDate" type="date" value={editingNewLicense.expiryDate} onChange={handleNewLicenseChange} disabled={isSavingCert} /></div>
              <div><label className="block text-sm font-bold mb-2">Validity / سارية؟</label><select name="status" value={editingNewLicense.status} onChange={handleNewLicenseChange} className="w-full p-3 border rounded-lg"><option value="valid">Valid / سارية</option><option value="expiring">Expiring Soon / تنتهي قريباً</option><option value="expired">Expired / منتهية</option></select></div><FormField label="PDF Link" name="pdfUrl" type="url" value={editingNewLicense.pdfUrl} onChange={handleNewLicenseChange} disabled={isSavingCert} />
              <div className="flex gap-4 pt-6 border-t"><button type="button" onClick={saveNewLicense} disabled={isSavingCert} className="flex-1 py-3 bg-omega-dark text-white rounded-lg font-bold">{isSavingCert ? 'Saving...' : 'Save License'}</button><button type="button" onClick={() => setEditingNewLicense(null)} className="px-8 py-3 bg-gray-200 rounded-lg font-bold">Cancel</button></div>
            </div></div>}
          </div>
        )}
      </main>
      
      {/* Image Editor Modal */}
      {imageEditorOpen && imageEditorCallback && (
        <ImageEditor
          imageSrc={imageEditorSource}
          onSave={(croppedImage) => {
            imageEditorCallback(croppedImage);
            setImageEditorOpen(false);
          }}
          onClose={() => setImageEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
