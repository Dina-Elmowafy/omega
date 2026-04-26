import { User, CompanyInfo, ServiceItem, InspectionCertificate, LicenseRecord, HomePageContent, AboutPageContent } from '../types';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { COMPANY_INFO, SERVICES, MOCK_PROJECTS, INDUSTRIES, WHY_CHOOSE_US } from '../constants';

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const isAdmin = email.includes('admin');
          if (isAdmin && password === 'admin123') {
            const user: User = { id: 'admin-1', name: 'System Admin', companyName: 'OMEGA', role: 'admin', email, avatar: '' };
            resolve({ user, token: 'mock-jwt-token' });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 800);
      });
    }
  },

  company: {
    get: async (): Promise<CompanyInfo> => {
      try {
        const docSnap = await getDoc(doc(db, "content", "company"));
        if (docSnap.exists()) return docSnap.data() as CompanyInfo;
      } catch (error) {}
      return COMPANY_INFO;
    },
    update: async (data: CompanyInfo): Promise<void> => {
      await setDoc(doc(db, "content", "company"), data);
    }
  },

  homePage: {
    get: async (): Promise<HomePageContent> => {
      try {
        const docSnap = await getDoc(doc(db, "content", "home"));
        if (docSnap.exists()) {
          const data = docSnap.data() as HomePageContent;
          return {
            ...data,
            industriesTitle: data.industriesTitle || "INDUSTRIES WE SERVE",
            industriesSubtitle: data.industriesSubtitle || "Delivering strategic solutions across vital sectors...",
            industries: data.industries?.length ? data.industries : INDUSTRIES,
            whyChooseUsTitle: data.whyChooseUsTitle || "WHY CHOOSE OMEGA?",
            whyChooseUsImage: data.whyChooseUsImage || "image/WHY CHOOSE OMEGA.png",
            whyChooseUsItems: data.whyChooseUsItems?.length ? data.whyChooseUsItems : WHY_CHOOSE_US
          };
        }
      } catch (error) {}
      return {
        heroTitle: "ALWAYS DELIVER \n", 
        heroTitleAr: "نحن دائماً نقدم \n",
        heroHighlight: "MORE THAN EXPECTED", 
        heroHighlightAr: "أكثر مما تتوقع",
        heroSubtitle: "Your trusted partner for Inspection, NDT, and Construction Services.", 
        heroSubtitleAr: "شريكك الموثوق لخدمات الفحص والاختبارات غير الإتلافية وخدمات البناء.",
        heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80",
        stats: [ 
          { label: "Completed Projects", labelAr: "مشاريع مكتملة", val: "150+" }, 
          { label: "Certified Staff", labelAr: "موظف معتمد", val: "50+" }, 
          { label: "Years Experience", labelAr: "سنوات خبرة", val: "5+" }, 
          { label: "Clients Served", labelAr: "عملاء خدمناهم", val: "40+" } 
        ],
        industriesTitle: "INDUSTRIES WE SERVE", 
        industriesTitleAr: "القطاعات التي نخدمها",
        industriesSubtitle: "Delivering strategic solutions across vital sectors...", 
        industriesSubtitleAr: "نقدم حلولاً استراتيجية عبر القطاعات الحيوية التي تتضمن بنية تحتية عالية التكلفة وعمليات معقدة.",
        industries: INDUSTRIES,
        whyChooseUsTitle: "WHY CHOOSE OMEGA?", 
        whyChooseUsTitleAr: "لماذا تختار أوميجا؟",
        whyChooseUsImage: "image/WHY CHOOSE OMEGA.png", 
        whyChooseUsItems: WHY_CHOOSE_US
      };
    },
    update: async (data: HomePageContent): Promise<void> => {
      await setDoc(doc(db, "content", "home"), data);
    }
  },

  aboutPage: {
    get: async (): Promise<AboutPageContent> => {
      try {
        const docSnap = await getDoc(doc(db, "content", "about"));
        if (docSnap.exists()) return docSnap.data() as AboutPageContent;
      } catch (error) {}
      return {
        title: "WHO WE ARE", subtitle: "Excellence in Engineering & Industrial Services", story: "Founded by a team of visionary engineers...", mission: "To deliver superior inspection...", vision: "To be the undisputed leader...", coverImage: "https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&q=80"
      };
    },
    update: async (data: AboutPageContent): Promise<void> => {
      await setDoc(doc(db, "content", "about"), data);
    }
  },

  services: {
    getAll: async (): Promise<ServiceItem[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        if (!querySnapshot.empty) return querySnapshot.docs.map(doc => doc.data() as ServiceItem);
      } catch (error) {}
      return SERVICES;
    },
    update: async (data: ServiceItem[]): Promise<void> => {
      for (const service of data) { await setDoc(doc(db, "services", service.id), service); }
    }
  },

  certificates: {
    getAll: async (): Promise<InspectionCertificate[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "certificates"));
        return querySnapshot.docs.map(doc => doc.data() as InspectionCertificate);
      } catch (error) { return []; }
    },
    addOrUpdate: async (cert: InspectionCertificate): Promise<void> => { await setDoc(doc(db, "certificates", cert.id), cert); },
    delete: async (id: string): Promise<void> => { await deleteDoc(doc(db, "certificates", id)); }
  },

  licenses: {
    getAll: async (): Promise<LicenseRecord[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "licenses"));
        return querySnapshot.docs.map(doc => doc.data() as LicenseRecord);
      } catch (error) { return []; }
    },
    addOrUpdate: async (license: LicenseRecord): Promise<void> => { await setDoc(doc(db, "licenses", license.id), license); },
    delete: async (id: string): Promise<void> => { await deleteDoc(doc(db, "licenses", id)); }
  },

  projects: { getAll: async () => MOCK_PROJECTS, update: async () => {} },
  blog: { getAll: async () => [], create: async () => {} },
  jobs: { getAll: async () => [] }
};