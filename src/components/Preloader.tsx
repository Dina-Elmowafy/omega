import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-omega-dark flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Logo variant="light" className="scale-125" />
      </motion.div>
      
      <div className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-omega-yellow"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default Preloader;