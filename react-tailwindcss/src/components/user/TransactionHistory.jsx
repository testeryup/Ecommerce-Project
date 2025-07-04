import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, CreditCard, TrendingUp, TrendingDown, Clock, Filter, Search } from 'lucide-react';
import transactionService from '../../services/transactionService';
import { formatCurrency } from '../../ultils/currencyHelper';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getUserTransactions();
      console.log('Transaction data received:', data);
      
      // The service should return an array directly
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.warn('Unexpected transaction data format, expected array:', data);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'topup':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'purchase':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'topup':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'purchase':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const filteredTransactions = (transactions || []).filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / 10);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 10;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý và theo dõi tất cả các giao dịch của bạn
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter by type */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả giao dịch</option>
                  <option value="topup">Nạp tiền</option>
                  <option value="purchase">Mua hàng</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm giao dịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Danh sách giao dịch ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'Không tìm thấy giao dịch nào phù hợp'
                    : 'Chưa có giao dịch nào'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getTransactionTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {transaction.description || `Giao dịch ${transaction.type}`}
                          </h3>
                          <Badge className={getTransactionTypeColor(transaction.type)}>
                            {transaction.type === 'topup' ? 'Nạp tiền' : 
                             transaction.type === 'purchase' ? 'Mua hàng' : transaction.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {transaction.order && (
                            <span>Đơn hàng: #{transaction.order._id?.slice(-6)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'topup' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'topup' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status === 'completed' ? 'Hoàn thành' :
                         transaction.status === 'pending' ? 'Đang xử lý' :
                         transaction.status === 'failed' ? 'Thất bại' : transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị {startIndex + 1}-{Math.min(startIndex + 10, filteredTransactions.length)} của {filteredTransactions.length} giao dịch
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
