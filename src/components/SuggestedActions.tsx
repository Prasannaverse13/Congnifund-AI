import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Target } from 'lucide-react';

interface SuggestedAction {
  label: string;
  action: string;
  icon: React.ReactNode;
  gradient: string;
}

const SuggestedActions: React.FC = () => {
  const actions: SuggestedAction[] = [
    {
      label: 'Optimize Portfolio',
      action: 'optimize',
      icon: <TrendingUp className="h-4 w-4" />,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      label: 'Find High Yield',
      action: 'yield',
      icon: <Target className="h-4 w-4" />,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      label: 'Risk Assessment',
      action: 'risk',
      icon: <Shield className="h-4 w-4" />,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      label: 'Auto Rebalance',
      action: 'auto',
      icon: <Zap className="h-4 w-4" />,
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.action}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`p-4 bg-gradient-to-r ${action.gradient} bg-opacity-20 hover:bg-opacity-30 rounded-lg border border-white/20 hover:border-white/30 transition-all group`}
        >
          <div className="flex items-center space-x-3">
            <div className="text-white group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedActions;