import { User, CompanyInfo, ServiceItem, InspectionCertificate, LicenseRecord, HomePageContent, AboutPageContent } from '../types';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { COMPANY_INFO, SERVICES, MOCK_PROJECTS, INDUSTRIES, WHY_CHOOSE_US } from '../constants';

const getComputedStatus = (expiryDate?: string): 'valid' | 'expiring' | 'expired' | null => {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
  if (diffDays <= 0) return 'expired';
  if (diffDays <= 30) return 'expiring';
  return 'valid';
};

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
        const updates: Promise<void>[] = [];
        const certificates = querySnapshot.docs.map((snapshot) => {
          const certificate = snapshot.data() as InspectionCertificate;
          const status = getComputedStatus(certificate.expiryDate);

          if (status && certificate.status !== status) {
            certificate.status = status;
            updates.push(setDoc(doc(db, "certificates", snapshot.id), certificate));
          }

          return certificate;
        }).filter(certificate => !(certificate as InspectionCertificate & { deletedAt?: string }).deletedAt);

        await Promise.all(updates);
        return certificates;
      } catch (error) { return []; }
    },
    addOrUpdate: async (cert: InspectionCertificate): Promise<void> => { await setDoc(doc(db, "certificates", cert.id), cert); },
    delete: async (id: string): Promise<void> => {
      const sourceRef = doc(db, "certificates", id);
      const snapshot = await getDoc(sourceRef);
      if (snapshot.exists()) {
        await setDoc(doc(db, "deletedCertificates", id), {
          ...snapshot.data(),
          deletedAt: new Date().toISOString(),
          deletedFrom: "certificates"
        });
      }
      await deleteDoc(sourceRef);
    },
    getDeleted: async (): Promise<(InspectionCertificate & { deletedAt?: string })[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "deletedCertificates"));
        return querySnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as InspectionCertificate & { deletedAt?: string }));
      } catch (error) { return []; }
    },
    restore: async (id: string): Promise<void> => {
      const deletedRef = doc(db, "deletedCertificates", id);
      const snapshot = await getDoc(deletedRef);
      if (!snapshot.exists()) return;

      const data = snapshot.data() as InspectionCertificate & { deletedAt?: string; deletedFrom?: string };
      delete data.deletedAt;
      delete data.deletedFrom;

      await setDoc(doc(db, "certificates", id), data);
      await deleteDoc(deletedRef);
    }
  },

  licenses: {
    getAll: async (): Promise<LicenseRecord[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "licenses"));
        const updates: Promise<void>[] = [];
        const licenses = querySnapshot.docs.map((snapshot) => {
          const license = snapshot.data() as LicenseRecord;
          const status = getComputedStatus(license.expiryDate);

          if (status && license.status !== status) {
            license.status = status;
            updates.push(setDoc(doc(db, "licenses", snapshot.id), license));
          }

          return license;
        }).filter(license => !(license as LicenseRecord & { deletedAt?: string }).deletedAt);

        await Promise.all(updates);
        return licenses;
      } catch (error) { return []; }
    },
    addOrUpdate: async (license: LicenseRecord): Promise<void> => { await setDoc(doc(db, "licenses", license.id), license); },
    delete: async (id: string): Promise<void> => {
      const sourceRef = doc(db, "licenses", id);
      const snapshot = await getDoc(sourceRef);
      if (snapshot.exists()) {
        await setDoc(doc(db, "deletedLicenses", id), {
          ...snapshot.data(),
          deletedAt: new Date().toISOString(),
          deletedFrom: "licenses"
        });
      }
      await deleteDoc(sourceRef);
    },
    getDeleted: async (): Promise<(LicenseRecord & { deletedAt?: string })[]> => {
      try {
        const querySnapshot = await getDocs(collection(db, "deletedLicenses"));
        return querySnapshot.docs.map(snapshot => ({ id: snapshot.id, ...snapshot.data() } as LicenseRecord & { deletedAt?: string }));
      } catch (error) { return []; }
    },
    restore: async (id: string): Promise<void> => {
      const deletedRef = doc(db, "deletedLicenses", id);
      const snapshot = await getDoc(deletedRef);
      if (!snapshot.exists()) return;

      const data = snapshot.data() as LicenseRecord & { deletedAt?: string; deletedFrom?: string };
      delete data.deletedAt;
      delete data.deletedFrom;

      await setDoc(doc(db, "licenses", id), data);
      await deleteDoc(deletedRef);
    }
  },

  projects: { getAll: async () => MOCK_PROJECTS, update: async () => {} },
  blog: { getAll: async () => [], create: async () => {} },
  jobs: { getAll: async () => [] }
};
