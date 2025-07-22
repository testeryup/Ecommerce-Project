import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import './Categories.scss';

function CategoryModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: '',
    subcategories: [''],
    description: ''
  });
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        subcategories: Array.isArray(initial.subcategories) ? initial.subcategories.map(sub => sub.name) : [''],
        description: initial.description || ''
      });
    } else {
      setForm({ name: '', subcategories: [''], description: '' });
    }
  }, [initial]);

  const handleSubChange = (idx, value) => {
    setForm(f => {
      const arr = [...f.subcategories];
      arr[idx] = value;
      return { ...f, subcategories: arr };
    });
  };
  const handleAddSub = () => setForm(f => ({ ...f, subcategories: [...f.subcategories, ''] }));
  const handleRemoveSub = idx => setForm(f => {
    const arr = [...f.subcategories];
    arr.splice(idx, 1);
    return { ...f, subcategories: arr.length ? arr : [''] };
  });

  const handleSubmit = e => {
    e.preventDefault();
    const subArr = form.subcategories.map(s => s.trim()).filter(Boolean);
    if (!form.name.trim() || subArr.length === 0) {
      toast.error('Tên và subcategory là bắt buộc');
      return;
    }
    onSave({ ...form, subcategories: subArr });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4">{initial ? 'Sửa danh mục' : 'Thêm danh mục'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên danh mục</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Subcategories</label>
            <div className="space-y-2">
              {form.subcategories.map((sub, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 border px-3 py-2 rounded"
                    value={sub}
                    onChange={e => handleSubChange(idx, e.target.value)}
                    placeholder={`Subcategory #${idx + 1}`}
                    required={!!sub}
                  />
                  {form.subcategories.length > 1 && (
                    <button type="button" className="text-red-500 px-2 py-1" onClick={() => handleRemoveSub(idx)} title="Xóa">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" className="text-blue-600 underline mt-1" onClick={handleAddSub}>+ Thêm subcategory</button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Mô tả</label>
            <textarea className="w-full border px-3 py-2 rounded" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, hasNext: false, hasPrev: false });
  const [filters, setFilters] = useState({ search: '', page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, initial: null });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/categories', { params: { search: filters.search, page: filters.page, limit: filters.limit } });
      if (res.errCode === 0) {
        setCategories(res.data.categories);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.message || 'Lỗi lấy danh mục');
      }
    } catch (e) {
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [filters]);

  const handleSave = async (form) => {
    try {
      if (modal.initial) {
        // Update
        const res = await api.put(`/api/admin/categories/${modal.initial._id}`, form);
        if (res.errCode === 0) {
          toast.success('Cập nhật thành công');
          setModal({ open: false, initial: null });
          fetchCategories();
        } else {
          toast.error(res.message || 'Lỗi cập nhật');
        }
      } else {
        // Create
        const res = await api.post('/api/admin/categories', form);
        if (res.errCode === 0) {
          toast.success('Thêm thành công');
          setModal({ open: false, initial: null });
          fetchCategories();
        } else {
          toast.error(res.message || 'Lỗi thêm danh mục');
        }
      }
    } catch (e) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) return;
    try {
      const res = await api.delete(`/api/admin/categories/${cat._id}`);
      if (res.errCode === 0) {
        toast.success('Xóa thành công');
        fetchCategories();
      } else {
        toast.error(res.message || 'Lỗi xóa danh mục');
      }
    } catch (e) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));
  };

  return (
    <div className="admin-categories">
      <div className="categories-header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModal({ open: true, initial: null })}>Thêm danh mục</button>
      </div>
      <div className="filters-section flex gap-4 mb-4">
        <div className="search-bar flex items-center gap-2">
          <FontAwesomeIcon icon="search" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>
      <div className="categories-table overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Tên danh mục</th>
              <th className="border px-4 py-2">Subcategories</th>
              <th className="border px-4 py-2">Mô tả</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Đang tải...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Không có danh mục nào</td></tr>
            ) : categories.map(cat => (
              <tr key={cat._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold align-top">{cat.name}</td>
                <td className="border px-4 py-2 align-top">
                  <ul className="list-disc pl-5 space-y-1">
                    {Array.isArray(cat.subcategories) && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub, idx) => (
                        <li key={sub._id || idx}>{sub.name}</li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">Không có</li>
                    )}
                  </ul>
                </td>
                <td className="border px-4 py-2 align-top">{cat.description || <span className="text-gray-400 italic">Không có</span>}</td>
                <td className="border px-4 py-2 align-top">
                  <button className="text-blue-600 mr-2 underline" onClick={() => setModal({ open: true, initial: cat })}>Sửa</button>
                  <button className="text-red-600 underline" onClick={() => handleDelete(cat)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex items-center gap-2 mt-4">
        <button
          className="page-btn px-3 py-1 border rounded"
          disabled={!pagination.hasPrev}
          onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
        >
          <FontAwesomeIcon icon="chevron-left" />
        </button>
        <span className="page-info">
          Trang {pagination.currentPage} / {pagination.totalPages}
        </span>
        <button
          className="page-btn px-3 py-1 border rounded"
          disabled={!pagination.hasNext}
          onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
        >
          <FontAwesomeIcon icon="chevron-right" />
        </button>
        <select
          className="page-size-select border rounded px-2 py-1"
          value={filters.limit}
          onChange={e => handleFilterChange('limit', Number(e.target.value))}
        >
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
      </div>
      <CategoryModal
        open={modal.open}
        onClose={() => setModal({ open: false, initial: null })}
        onSave={handleSave}
        initial={modal.initial}
      />
    </div>
  );
} 