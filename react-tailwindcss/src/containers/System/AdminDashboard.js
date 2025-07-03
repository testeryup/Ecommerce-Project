import React, { Suspense } from 'react';
import Loading from '../../components/Loading';

// Dynamic import for code splitting
const AdminDashboard = React.lazy(() => 
  import('../../components/admin/AdminDashboard').then(module => ({
    default: module.default
  }))
);

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loading />}>
        <AdminDashboard />
      </Suspense>
    </div>
  );
};

export default AdminDashboardPage;
