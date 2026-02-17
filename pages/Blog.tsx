import React from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, User } from 'lucide-react';

const Blog: React.FC = () => {
  const { blogPosts } = useData();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="bg-white py-16 border-b border-gray-200 text-center">
        <h1 className="text-4xl font-display font-bold text-omega-dark mb-2">LATEST NEWS</h1>
        <p className="text-gray-500">Updates from OMEGA Petroleum Services</p>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-omega-blue transition-colors">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <button className="text-omega-yellow font-bold uppercase text-xs tracking-wider hover:text-omega-dark transition-colors">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
