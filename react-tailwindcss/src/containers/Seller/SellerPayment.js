import React, { useState, useEffect } from 'react';
import { getWithdrawalRequests, createWithdrawalRequest } from '../../services/sellerService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency } from '../../ultils';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

export default function SellerPayment() {
    const [withdrawals, setWithdrawals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const response = await getWithdrawalRequests(filters);
            if (response.errCode === 0) {
                setWithdrawals(response.data);
            } else {
                toast.error('Không thể tải danh sách yêu cầu rút tiền');
            }
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            toast.error('Đã xảy ra lỗi khi tải danh sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [filters]);

    const handleCreateWithdrawal = async (e) => {
        e.preventDefault();
        try {
            const amount = parseInt(withdrawAmount);
            if (!amount || amount <= 0) {
                toast.error('Vui lòng nhập số tiền hợp lệ');
                return;
            }
            const response = await createWithdrawalRequest({ amount });
            if (response.errCode === 0) {
                toast.success('Yêu cầu rút tiền đã được tạo thành công');
                setIsWithdrawModalOpen(false);
                setWithdrawAmount('');
                fetchWithdrawals();
            } else {
                toast.error(response.errMessage || 'Không thể tạo yêu cầu rút tiền');
            }
        } catch (error) {
            console.error('Error creating withdrawal request:', error);
            toast.error('Đã xảy ra lỗi khi tạo yêu cầu');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="seller-payment-container">
            <div className="payment-header">
                <h2>Quản lý Rút tiền</h2>
                <button className="btn-primary" onClick={() => setIsWithdrawModalOpen(true)}>
                    <FontAwesomeIcon icon="plus" /> Yêu cầu Rút tiền
                </button>
            </div>

            <div className="payment-filters">
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="all">Tất cả Trạng thái</option>
                    <option value="pending">Đang chờ</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Bị từ chối</option>
                </select>
                <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                    <option value="createdAt">Ngày tạo</option>
                    <option value="amount">Số tiền</option>
                </select>
                <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                    <option value="desc">Giảm dần</option>
                    <option value="asc">Tăng dần</option>
                </select>
            </div>

            <div className="payment-list">
                {withdrawals && withdrawals.rows.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Ngày xử lý</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.rows.map(w => (
                                <tr key={w.id}>
                                    <td>{w.id}</td>
                                    <td>{formatCurrency(w.amount)}</td>
                                    <td>
                                        <span className={`status-badge status-${w.status.toLowerCase()}`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td>{new Date(w.createdAt).toLocaleString()}</td>
                                    <td>{w.processedAt ? new Date(w.processedAt).toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không có yêu cầu rút tiền nào.</p>
                )}
            </div>

            {withdrawals && withdrawals.totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: withdrawals.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`page-item ${filters.page === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {isWithdrawModalOpen && (
                <div className="withdraw-modal-overlay">
                    <div className="withdraw-modal">
                        <h3>Tạo Yêu cầu Rút tiền</h3>
                        <form onSubmit={handleCreateWithdrawal}>
                            <div className="form-group">
                                <label htmlFor="withdrawAmount">Số tiền</label>
                                <input
                                    type="number"
                                    id="withdrawAmount"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="Nhập số tiền muốn rút"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Xác nhận</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsWithdrawModalOpen(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
