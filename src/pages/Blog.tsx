import React from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, User } from 'lucide-react';

const Blog: React.FC = () => {
  const { blogPosts } = useData();

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 py-16 border-b border-gray-200 dark:border-slate-700 text-center transition-colors">
        <h1 className="text-4xl font-display font-bold text-omega-dark dark:text-white mb-2">LATEST NEWS</h1>
        <p className="text-gray-500 dark:text-gray-400">Updates from OMEGA Petroleum Services</p>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group border border-transparent dark:border-slate-700">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-omega-blue dark:group-hover:text-omega-yellow transition-colors">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <button className="text-omega-yellow font-bold uppercase text-xs tracking-wider hover:text-omega-dark dark:hover:text-white transition-colors">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;