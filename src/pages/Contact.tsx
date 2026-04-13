import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { COMPANY_INFO } from '../constants';
import { Helmet } from 'react-helmet-async';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ⚠️ استبدلي هذه القيم ببيانات حسابك من موقع EmailJS
      const serviceId = 'YOUR_SERVICE_ID';
      const templateId = 'YOUR_TEMPLATE_ID';
      const publicKey = 'YOUR_PUBLIC_KEY';

      await emailjs.send(serviceId, templateId, formData, publicKey);
      
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Helmet>
        <title>Contact Us - OMEGA Petroleum & Construction Services</title>
        <meta name="description" content="Get in touch with OMEGA for industrial inspections, rope access, and NDT services in Egypt." />
      </Helmet>

      <div className="bg-omega-dark py-20 text-center text-white">
        <h1 className="text-5xl font-display font-bold mb-4">CONTACT US</h1>
        <p className="text-gray-400 max-w-xl mx-auto">We are available for inquiries and emergency support. Reach out to our team.</p>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="lg:w-5/12 space-y-8">
            <h3 className="text-3xl font-display font-bold text-omega-dark dark:text-white mb-2">Get in Touch</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Have a project in mind? Send us a message or visit our office.</p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-5 group">
                <div className="bg-omega-yellow text-omega-dark p-4 rounded shadow-sm group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
                <div><h4 className="font-bold text-gray-800 dark:text-white text-lg">Head Office</h4><p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{COMPANY_INFO.address}</p></div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="bg-omega-yellow text-omega-dark p-4 rounded shadow-sm group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                <div><h4 className="font-bold text-gray-800 dark:text-white text-lg">Phone Support</h4><p className="text-gray-600 dark:text-gray-400 mt-1">{COMPANY_INFO.phone}</p></div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="bg-omega-yellow text-omega-dark p-4 rounded shadow-sm group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                <div><h4 className="font-bold text-gray-800 dark:text-white text-lg">Email</h4><p className="text-gray-600 dark:text-gray-400 mt-1">{COMPANY_INFO.email}</p></div>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12">
             <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-xl shadow-lg border-t-4 border-omega-yellow transition-colors">
               <h3 className="text-2xl font-bold text-omega-dark dark:text-white mb-8">Send a Request</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                   <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-lg focus:border-omega-yellow outline-none" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Phone Number</label>
                   <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-lg focus:border-omega-yellow outline-none" placeholder="+20..." />
                 </div>
               </div>
               
               <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                 <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-lg focus:border-omega-yellow outline-none" placeholder="name@company.com" />
               </div>
               
               <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Service of Interest</label>
                 <select required name="service" value={formData.service} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-lg focus:border-omega-yellow outline-none">
                   <option value="">Select a service...</option>
                   <option value="Rope Access">Rope Access</option>
                   <option value="Lifting Inspection">Lifting Inspection</option>
                   <option value="NDT Services">NDT Services</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               
               <div className="mb-8">
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Message Details</label>
                 <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white rounded-lg focus:border-omega-yellow outline-none" placeholder="Tell us about your project..."></textarea>
               </div>
               
               <button disabled={loading} type="submit" className="w-full bg-omega-dark dark:bg-omega-yellow dark:text-omega-dark text-white py-4 font-bold uppercase tracking-wide rounded-full hover:bg-omega-blue transition-all shadow-lg flex justify-center items-center gap-2">
                 {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <><Send size={18} /> Submit Inquiry</>}
               </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;