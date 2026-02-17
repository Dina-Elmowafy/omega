import { ServiceItem, InspectionCertificate, ProjectUpdate, CompanyInfo, User, BlogPost, JobPosition } from '../types';
import { SERVICES, COMPANY_INFO, MOCK_CERTIFICATES, MOCK_PROJECTS } from '../constants';

// --- CONFIGURATION ---
// Default to TRUE so it works immediately. Set to FALSE to use real backend.
const USE_MOCK = true; 
const API_URL = 'http://localhost:5000/api';

// --- MOCK STORAGE HELPER ---
const getStorage = <T>(key: string, initial: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  } catch (e) {
    return initial;
  }
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API SERVICE CLASS ---
export const api = {
  
  // 1. AUTHENTICATION
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
      if (USE_MOCK) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const isAdmin = email.includes('admin');
            // Read admin secret from environment variable to avoid embedding it in source
            const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined;
            if (isAdmin) {
              if (!ADMIN_PASSWORD) {
                reject(new Error('Admin password not configured (VITE_ADMIN_PASSWORD)'));
                return;
              }
              if (password === ADMIN_PASSWORD) {
                const user: User = {
                  id: 'admin-1',
                  name: 'System Administrator',
                  companyName: 'OMEGA Internal',
                  role: 'admin',
                  email,
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                };
                resolve({ user, token: 'mock-jwt-token-123' });
                return;
              }
              reject(new Error('Invalid credentials'));
              return;
            }
            // Non-admin users not allowed in this app
            reject(new Error('Client access not allowed'));
          }, 800);
        });
      } else {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      }
    }
  },

  // 2. COMPANY INFO (CMS)
  company: {
    get: async (): Promise<CompanyInfo> => {
      if (USE_MOCK) return getStorage('omega_companyInfo', COMPANY_INFO);
      const res = await fetch(`${API_URL}/content/company-info`);
      return res.json();
    },
    update: async (data: CompanyInfo): Promise<void> => {
      if (USE_MOCK) return setStorage('omega_companyInfo', data);
      await fetch(`${API_URL}/content/company-info`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(data)
      });
    }
  },

  // 3. SERVICES
  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      if (USE_MOCK) {
        const stored = localStorage.getItem('omega_services');
        // إذا لم توجد بيانات محفوظة، استخدم SERVICES الافتراضية فقط مرة واحدة
        if (!stored) {
          localStorage.setItem('omega_services', JSON.stringify(SERVICES));
          return SERVICES;
        }
        return getStorage('omega_services', SERVICES);
      }
      const res = await fetch(`${API_URL}/services`);
      return res.json();
    },
    update: async (data: ServiceItem[]): Promise<void> => {
      if (USE_MOCK) {
        // تأكد من عدم وجود نسخ مزدوجة: احذف النسخ المكررة بناءً على الـ ID
        const uniqueServices = Array.from(
          new Map(data.map(s => [s.id, s])).values()
        );
        return setStorage('omega_services', uniqueServices);
      }
      await fetch(`${API_URL}/services`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data) 
      });
    }
  },

  // 4. CERTIFICATES
  certificates: {
    getAll: async (): Promise<InspectionCertificate[]> => {
      if (USE_MOCK) return getStorage('omega_certificates', MOCK_CERTIFICATES);
      const res = await fetch(`${API_URL}/certificates`, {
         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      return res.json();
    },
    update: async (data: InspectionCertificate[]): Promise<void> => {
      if (USE_MOCK) return setStorage('omega_certificates', data);
    }
  },

  // 5. PROJECTS
  projects: {
    getAll: async (): Promise<ProjectUpdate[]> => {
      if (USE_MOCK) return getStorage('omega_projects', MOCK_PROJECTS);
      const res = await fetch(`${API_URL}/projects`);
      return res.json();
    },
    update: async (data: ProjectUpdate[]): Promise<void> => {
      if (USE_MOCK) return setStorage('omega_projects', data);
    }
  },
  
  // 6. BLOG
  blog: {
    getAll: async (): Promise<BlogPost[]> => {
      if (USE_MOCK) return getStorage('omega_blogPosts', []);
      const res = await fetch(`${API_URL}/blog`);
      return res.json();
    },
    create: async (post: BlogPost): Promise<void> => {
      if (USE_MOCK) {
        const posts = getStorage<BlogPost[]>('omega_blogPosts', []);
        setStorage('omega_blogPosts', [post, ...posts]);
        return;
      }
    }
  },

  // 7. JOBS
  jobs: {
    getAll: async (): Promise<JobPosition[]> => {
      if (USE_MOCK) return getStorage('omega_jobs', []);
      return [];
    }
  }
};