import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: Icon, 
  color = 'blue',
  format = 'number'
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(val);
    }
    if (format === 'percent') {
      return `${val}%`;
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toString();
  };

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-600'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-600'
    },
    green: {
      bg: 'from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-600'
    },
    orange: {
      bg: 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-600'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentColor.bg} transition-opacity duration-300 group-hover:opacity-90`}></div>
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium transition-colors duration-200">{title}</CardTitle>
        <div className={`p-2 ${currentColor.iconBg} rounded-lg transition-transform duration-200 group-hover:scale-110`}>
          <Icon className={`h-4 w-4 ${currentColor.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold transition-all duration-300">
          {formatValue(value)}
        </div>
        {change && (
          <div className="flex items-center gap-1 text-xs mt-1 transition-opacity duration-200">
            {changeType === 'positive' ? (
              <ArrowUpRight className="h-3 w-3 text-green-600 animate-pulse" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600 animate-pulse" />
            )}
            <span className={`font-medium ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {change}%
            </span>
            <span className="text-muted-foreground">so với tháng trước</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
