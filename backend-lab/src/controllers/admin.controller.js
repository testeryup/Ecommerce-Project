import bcrypt from 'bcryptjs'; // Add this import
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import Transaction from '../models/transaction.js';
import Inventory from '../models/inventory.js';
import mongoose from 'mongoose';
import Category from '../models/category.js';

export const createSeller = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await User.create({
      email,
      password: hashedPassword,
      username,
      role: 'seller'
    });

    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.status = 'deleted';
    await seller.save();
    const products = await Product.updateMany({
      seller: seller._id,
      isDeleted: false
    }, {
      isDeleted: true
    });
    // if(products.acknowledged && )
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const { timeRange = 'month', startDate, endDate } = req.query;
    
    const now = new Date();
    let startDateTime, endDateTime;
    
    // Xử lý bộ lọc thời gian
    if (startDate && endDate) {
      // Nếu có startDate và endDate, sử dụng chúng
      startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
    } else {
      // Sử dụng timeRange mặc định
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (timeRange) {
        case 'today':
          startDateTime = today;
          endDateTime = new Date(today);
          endDateTime.setHours(23, 59, 59, 999);
          break;
        case 'week':
          startDateTime = new Date(today);
          startDateTime.setDate(today.getDate() - 7);
          endDateTime = new Date(today);
          endDateTime.setHours(23, 59, 59, 999);
          break;
        case 'month':
        default:
          startDateTime = new Date(today);
          startDateTime.setDate(today.getDate() - 30);
          endDateTime = new Date(today);
          endDateTime.setHours(23, 59, 59, 999);
          break;
      }
    }

    console.log('Date ranges:', {
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      timeRange: startDate && endDate ? 'custom' : timeRange,
      customDates: startDate && endDate ? { startDate, endDate } : null
    });

    // User Statistics
    const userStats = await User.aggregate([
      {
        $facet: {
          roleStats: [
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 }
              }
            }
          ],
          suspendedCount: [
            {
              $match: { status: 'suspended' }
            },
            { $count: 'total' }
          ],
          newUsers: [
            {
              $match: {
                createdAt: { $gte: startDateTime, $lte: endDateTime }
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);
    
    // Revenue Statistics from Orders
    const revenueStats = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: startDateTime, $lte: endDateTime }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Deposit Statistics
    const depositStats = await Transaction.aggregate([
      {
        $match: {
          type: 'deposit',
          status: 'completed',
          createdAt: { $gte: startDateTime, $lte: endDateTime }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Product Statistics
    const productStats = await Product.aggregate([
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Process and format the data for response
    const formatTimeSeriesData = (data, startDate, endDate) => {
      const dates = {};
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dates[dateStr] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      data.forEach(item => {
        dates[item._id.date] = item.total || item.revenue || item.count;
      });

      return Object.entries(dates).map(([date, value]) => ({
        date,
        value
      }));
    };

    const formatTimeSeriesDataForUsers = (data, startDate, endDate) => {
      const dates = {};
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dates[dateStr] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      data.forEach(item => {
        dates[item._id] = item.total || item.revenue || item.count;
      });

      return Object.entries(dates).map(([date, value]) => ({
        date,
        value
      }));
    };

    // Tính toán tổng số liệu cho khoảng thời gian được chọn
    const totalRevenue = revenueStats.reduce((sum, r) => sum + r.revenue, 0);
    const totalOrders = revenueStats.reduce((sum, r) => sum + r.count, 0);
    const totalDeposits = depositStats.reduce((sum, d) => sum + d.total, 0);
    const totalNewUsers = userStats[0].newUsers.reduce((sum, u) => sum + u.count, 0);

    const response = {
      users: {
        total: {
          users: userStats[0].roleStats.find(r => r._id === 'user')?.count || 0,
          sellers: userStats[0].roleStats.find(r => r._id === 'seller')?.count || 0,
          admins: userStats[0].roleStats.find(r => r._id === 'admin')?.count || 0,
          suspended: userStats[0].suspendedCount[0]?.total || 0
        },
        timeline: formatTimeSeriesDataForUsers(userStats[0].newUsers, startDateTime, endDateTime),
        periodTotal: totalNewUsers
      },
      revenue: {
        timeline: formatTimeSeriesData(revenueStats, startDateTime, endDateTime),
        periodTotal: totalRevenue
      },
      orders: {
        timeline: formatTimeSeriesData(revenueStats.map(r => ({ _id: r._id, count: r.count })), startDateTime, endDateTime),
        periodTotal: totalOrders
      },
      deposits: {
        timeline: formatTimeSeriesData(depositStats, startDateTime, endDateTime),
        periodTotal: totalDeposits
      },
      products: {
        total: productStats[0].total[0]?.count || 0,
        active: productStats[0].byStatus.find(s => s._id === 'active')?.count || 0,
        inactive: productStats[0].byStatus.find(s => s._id === 'inactive')?.count || 0,
        pending: productStats[0].byStatus.find(s => s._id === 'pending')?.count || 0
      },
      filter: {
        timeRange: startDate && endDate ? 'custom' : timeRange,
        startDate: startDateTime.toISOString().split('T')[0],
        endDate: endDateTime.toISOString().split('T')[0],
        customDates: startDate && endDate ? { startDate, endDate } : null
      }
    };

    res.status(200).json({
      errCode: 0,
      message: 'Get admin statistics successfully',
      data: response
    });

  } catch (error) {
    console.error('Error in getAdminStats:', error);
    res.status(500).json({
      errCode: 1,
      message: error.message || 'Internal server error'
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role?.toLowerCase() || 'all';
    const status = req.query.status?.toLowerCase() || 'all';
    const search = req.query.search || '';

    // Build match condition
    const matchCondition = {};

    // Filter by role
    if (role !== 'all') {
      matchCondition.role = role;
    }

    // Filter by status
    if (status !== 'all') {
      matchCondition.status = status;
    }

    // Search by username or email
    if (search) {
      matchCondition.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(matchCondition);

    // Aggregate pipeline
    const users = await User.aggregate([
      {
        $match: matchCondition
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'buyer',
          pipeline: [
            {
              $match: {
                status: 'completed'
              }
            },
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$total' },
                orderCount: { $sum: 1 }
              }
            }
          ],
          as: 'orderStats'
        }
      },
      {
        $addFields: {
          orderStats: {
            $ifNull: [{ $arrayElemAt: ['$orderStats', 0] }, { totalSpent: 0, orderCount: 0 }]
          }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
          status: 1,
          balance: 1,
          createdAt: 1,
          totalSpent: '$orderStats.totalSpent',
          orderCount: '$orderStats.orderCount'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    // Get role counts
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get status counts
    const statusCounts = await User.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNext = page * limit < totalUsers;
    const hasPrev = page > 1;

    return res.status(200).json({
      errCode: 0,
      message: "Get users successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalUsers,
          itemsPerPage: limit,
          hasNext,
          hasPrev
        },
        filters: {
          role: {
            current: role,
            available: {
              all: roleCounts.reduce((sum, r) => sum + r.count, 0),
              ...Object.fromEntries(roleCounts.map(r => [r._id, r.count]))
            }
          },
          status: {
            current: status,
            available: {
              all: statusCounts.reduce((sum, s) => sum + s.count, 0),
              ...Object.fromEntries(statusCounts.map(s => [s._id, s.count]))
            }
          },
          search: search
        }
      }
    });

  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({
      errCode: 1,
      message: error.message || 'Internal server error'
    });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const newRole = req.body.role; // Fixed: changed from status to role
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const roles = ['seller', 'user', 'admin'];

    // Input validation
    if (!newRole || !roles.includes(newRole)) {
      return res.status(400).json({
        errCode: 1,
        message: 'Invalid role specified'
      });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        errCode: 1,
        message: 'User not found'
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { role: newRole },
      { new: true }
    );

    return res.status(200).json({
      errCode: 0,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    const userId = req.body.userId;
    const allowedStatuses = ['active', 'suspended', 'deleted'];

    // Input validation
    if (!newStatus || !allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        errCode: 1,
        message: 'Invalid status specified'
      });
    }

    if (!userId) {
      return res.status(400).json({
        errCode: 1,
        message: 'User ID is required'
      });
    }

    // Convert to ObjectId after validation
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user exists
    const userExists = await User.findById(userObjectId);
    if (!userExists) {
      return res.status(404).json({
        errCode: 1,
        message: 'User not found'
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userObjectId },
      { status: newStatus },
      { new: true }
    );

    return res.status(200).json({
      errCode: 0,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, balance } = req.body;

    // Input validation
    if (!userId) {
      return res.status(400).json({
        errCode: 1,
        message: 'User ID is required'
      });
    }

    // Convert to ObjectId after validation
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if user exists
    const userExists = await User.findById(userObjectId);
    if (!userExists) {
      return res.status(404).json({
        errCode: 1,
        message: 'User not found'
      });
    }

    // Build update object with only provided fields
    const updateData = {};

    if (username) {
      // Check if username is already taken by another user
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userObjectId }
      });

      if (usernameExists) {
        return res.status(400).json({
          errCode: 1,
          message: 'Username is already taken'
        });
      }
      updateData.username = username;
    }

    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          errCode: 1,
          message: 'Invalid email format'
        });
      }

      // Check if email is already taken by another user
      const emailExists = await User.findOne({
        email,
        _id: { $ne: userObjectId }
      });

      if (emailExists) {
        return res.status(400).json({
          errCode: 1,
          message: 'Email is already taken'
        });
      }
      updateData.email = email;
    }

    if (balance !== undefined) {
      // Validate balance is a non-negative number
      const newBalance = Number(balance);
      if (isNaN(newBalance) || newBalance < 0) {
        return res.status(400).json({
          errCode: 1,
          message: 'Balance must be a non-negative number'
        });
      }
      updateData.balance = newBalance;
    }

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        errCode: 1,
        message: 'No valid fields to update'
      });
    }

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userObjectId },
      updateData,
      {
        new: true,
        select: '-password' // Exclude password from response
      }
    );

    return res.status(200).json({
      errCode: 0,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({
      errCode: 1,
      message: error.message || 'Internal server error'
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';
    const seller = req.query.seller || 'all';
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const matchCondition = {};
    
    if (status !== 'all') {
      if (status === 'deleted') {
        matchCondition.isDeleted = true;
      } else if (status === 'active') {
        matchCondition.isDeleted = false;
        matchCondition.$or = [
          { status: { $exists: false } },
          { status: 'active' },
          { status: { $ne: 'inactive' } }
        ];
      } else if (status === 'inactive') {
        matchCondition.isDeleted = false;
        matchCondition.status = 'inactive';
      }
    } else {
      // Show all products including deleted ones
    }
    
    if (seller !== 'all') {
      matchCondition.seller = new mongoose.Types.ObjectId(seller);
    }
    
    if (search) {
      matchCondition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Match condition:', JSON.stringify(matchCondition, null, 2));
    
    const products = await Product.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'skus',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$product', '$$productId'] },
                isDeleted: false
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                price: 1,
                stock: 1,
                status: 1,
                sales: 1
              }
            }
          ],
          as: 'skus'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      {
        $addFields: {
          categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] },
          sellerInfo: { $arrayElemAt: ['$sellerInfo', 0] },
          totalStock: {
            $ifNull: [{ $sum: '$skus.stock' }, 0]
          },
          minPrice: {
            $ifNull: [{ $min: '$skus.price' }, 0]
          },
          totalSales: {
            $ifNull: [{ $sum: '$skus.sales.count' }, 0]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          images: 1,
          category: 1,
          categoryName: 1,
          subcategory: 1,
          seller: 1,
          sellerInfo: 1,
          skus: 1,
          totalStock: 1,
          minPrice: 1,
          totalSales: 1,
          status: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const total = await Product.countDocuments(matchCondition);

    res.status(200).json({
      errCode: 0,
      message: 'Get products successfully',
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};

export const changeProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['active', 'inactive', 'deleted'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        errCode: 1,
        message: 'Invalid status specified'
      });
    }

    let updateData = {};
    
    if (status === 'deleted') {
      updateData.isDeleted = true;
    } else {
      updateData.isDeleted = false;
      updateData.status = status;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate('seller', 'username');

    if (!product) {
      return res.status(404).json({
        errCode: 1,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      errCode: 0,
      message: 'Product status updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          statusStats: [
            {
              $group: {
                _id: {
                  $cond: {
                    if: '$isDeleted',
                    then: 'deleted',
                    else: {
                      $cond: {
                        if: { $eq: ['$status', 'inactive'] },
                        then: 'inactive',
                        else: 'active'
                      }
                    }
                  }
                },
                count: { $sum: 1 }
              }
            }
          ],
          sellerStats: [
            {
              $group: {
                _id: '$seller',
                productCount: { $sum: 1 }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'sellerInfo'
              }
            }
          ],
          totalProducts: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    res.status(200).json({
      errCode: 0,
      message: 'Get product statistics successfully',
      data: stats[0]
    });
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};

export const getTransactionStats = async (req, res) => {
  try {
    const { timeRange = 'month', startDate, endDate } = req.query;
    
    const now = new Date();
    let startDateTime, endDateTime;
    
    // Xử lý bộ lọc thời gian
    if (startDate && endDate) {
      // Nếu có startDate và endDate, sử dụng chúng
      startDateTime = new Date(startDate);
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
    } else {
      // Sử dụng timeRange mặc định
      const today = new Date(now);
      today.setUTCHours(0, 0, 0, 0);
      
      switch (timeRange) {
        case 'today':
          startDateTime = today;
          endDateTime = new Date(today);
          endDateTime.setUTCHours(23, 59, 59, 999);
          break;
        case 'week':
          startDateTime = new Date(today);
          startDateTime.setDate(today.getDate() - 7);
          endDateTime = new Date(today);
          endDateTime.setUTCHours(23, 59, 59, 999);
          break;
        case 'month':
        default:
          startDateTime = new Date(today);
          startDateTime.setDate(today.getDate() - 30);
          endDateTime = new Date(today);
          endDateTime.setUTCHours(23, 59, 59, 999);
          break;
      }
    }

    console.log('Transaction Stats Date ranges:', {
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      timeRange: startDate && endDate ? 'custom' : timeRange,
      customDates: startDate && endDate ? { startDate, endDate } : null
    });

    const stats = await Transaction.aggregate([
      {
        $facet: {
          // Summary stats for all time
          summary: [
            {
              $match: {
                createdAt: { $gte: startDateTime, $lte: endDateTime }
              }
            },
            {
              $group: {
                _id: '$type',
                count: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                total: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } },
                completed: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                pending: {
                  $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                },
                failed: {
                  $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
                }
              }
            }
          ],
          // Timeline data for selected period
          timeline: [
            {
              $match: {
                createdAt: { $gte: startDateTime, $lte: endDateTime }
              }
            },
            {
              $group: {
                _id: {
                  date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } },
                  type: '$type'
                },
                total: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } }
              }
            },
            { $sort: { '_id.date': 1 } }
          ],
          // Recent pending withdrawals
          recentWithdraws: [
            { 
              $match: { 
                type: 'withdrawal',
                status: 'pending'
              } 
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo'
              }
            },
            { $unwind: '$userInfo' },
            { 
              $project: {
                _id: 1,
                amount: 1,
                bankAccount: 1,
                status: 1,
                type: 1,
                createdAt: 1,
                'userInfo.username': 1,
                'userInfo.email': 1
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 5 }
          ],
          // Recent all transactions
          recentTransactions: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userInfo'
              }
            },
            { $unwind: '$userInfo' },
            { 
              $project: {
                _id: 1,
                amount: 1,
                status: 1,
                type: 1,
                createdAt: 1,
                username: '$userInfo.username',
                email: '$userInfo.email'
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 20 }
          ]
        }
      }
    ]);

    // Create date range for selected period with empty values
    const dates = {};
    const dateArray = [];
    let currentDate = new Date(startDateTime);

    while (currentDate <= endDateTime) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates[dateStr] = {
        deposit: 0,
        withdrawal: 0,
        refund: 0
      };
      dateArray.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill in actual data from timeline
    if (stats[0].timeline) {
      stats[0].timeline.forEach(entry => {
        const { date, type } = entry._id;
        if (dates[date] && dates[date].hasOwnProperty(type)) {
          dates[date][type] = entry.total;
        }
      });
    }

    // Convert to array format for chart data
    const chartData = dateArray.map(date => ({
      date,
      deposit: dates[date].deposit,
      withdrawal: dates[date].withdrawal,
      refund: dates[date].refund
    }));

    // Format summary data
    const summary = {
      deposit: stats[0].summary.find(s => s._id === 'deposit') || 
        { count: 0, total: 0, completed: 0, pending: 0, failed: 0 },
      withdrawal: stats[0].summary.find(s => s._id === 'withdrawal') || 
        { count: 0, total: 0, completed: 0, pending: 0, failed: 0 },
      refund: stats[0].summary.find(s => s._id === 'refund') || 
        { count: 0, total: 0, completed: 0, pending: 0, failed: 0 }
    };

    return res.status(200).json({
      errCode: 0,
      message: 'Get transaction statistics successfully',
      data: {
        summary,
        chartData,
        recentWithdraws: stats[0].recentWithdraws || [],
        recentTransactions: (stats[0].recentTransactions || []).map(t => ({
          id: t._id,
          amount: t.amount,
          status: t.status,
          type: t.type,
          createdAt: t.createdAt,
          username: t.username,
          email: t.email
        })),
        filter: {
          timeRange: startDate && endDate ? 'custom' : timeRange,
          startDate: startDateTime.toISOString().split('T')[0],
          endDate: endDateTime.toISOString().split('T')[0],
          customDates: startDate && endDate ? { startDate, endDate } : null
        }
      }
    });

  } catch (error) {
    console.error('Error in getTransactionStats:', error);
    return res.status(500).json({
      errCode: 1,
      message: error.message || 'Internal server error'
    });
  }
};

export const approveWithdraw = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ 
      _id: transactionId,
      type: 'withdrawal',
      status: 'pending'
    }).session(session);

    if (!transaction) {
      throw new Error('Transaction not found or already processed');
    }

    await User.findByIdAndUpdate(transaction.user, {
      $inc: {balance: -transaction.amount}
    }).session(session);


    // Update transaction status
    transaction.status = 'completed';
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      errCode: 0,
      message: 'Withdrawal approved successfully',
      data: transaction
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      errCode: 1,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

export const rejectWithdraw = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      throw new Error('Rejection reason is required');
    }

    const transaction = await Transaction.findOne({ 
      _id: transactionId,
      type: 'withdrawal',
      status: 'pending'
    }).session(session);

    if (!transaction) {
      throw new Error('Transaction not found or already processed');
    }

    // Refund the amount back to user's balance
    // await User.findByIdAndUpdate(
    //   transaction.user,
    //   { $inc: { balance: transaction.amount } },
    //   { session }
    // );

    // Update transaction status
    transaction.status = 'failed';
    transaction.metadata = { 
      ...transaction.metadata,
      rejectionReason: reason 
    };
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      errCode: 0,
      message: 'Withdrawal rejected successfully',
      data: transaction
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      errCode: 1,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

export const processRefund = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId, amount, reason } = req.body;

    // Validate input
    if (!orderId || !amount || !reason) {
      throw new Error('Missing required fields');
    }

    // Find order and validate
    const order = await Order.findOne({
      _id: orderId,
      status: 'completed',
      paymentStatus: 'completed'
    }).session(session);

    if (!order) {
      throw new Error('Order not found or cannot be refunded');
    }

    if (amount > order.total) {
      throw new Error('Refund amount cannot exceed order total');
    }

    // Create refund transaction
    const refundTransaction = await Transaction.create([{
      user: order.buyer,
      order: orderId,
      amount: amount,
      type: 'refund',
      status: 'completed',
      metadata: {
        reason,
        originalOrderTotal: order.total
      }
    }], { session });

    // Update user balance
    await User.findByIdAndUpdate(
      order.buyer,
      { $inc: { balance: amount } },
      { session }
    );

    // Update order status if full refund
    if (amount === order.total) {
      order.status = 'refunded';
    }
    order.refundAmount = (order.refundAmount || 0) + amount;
    await order.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      errCode: 0,
      message: 'Refund processed successfully',
      data: {
        refundTransaction: refundTransaction[0],
        order
      }
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      errCode: 1,
      message: error.message
    });
  } finally {
    session.endSession();
  }
};

export const getTransactions = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type || 'all';
    const status = req.query.status || 'all';
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build match condition
    const matchCondition = {};

    // Filter by type
    if (type !== 'all') {
      matchCondition.type = type;
    }

    // Filter by status
    if (status !== 'all') {
      matchCondition.status = status;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $match: {
          ...matchCondition,
          ...(search && {
            $or: [
              { 'userInfo.username': { $regex: search, $options: 'i' } },
              { 'userInfo.email': { $regex: search, $options: 'i' } }
            ]
          })
        }
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          type: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          rejectionReason: 1,
          username: '$userInfo.username',
          email: '$userInfo.email',
          userId: '$userInfo._id'
        }
      },
      { $sort: { [sortBy]: sortOrder } }
    ];

    // Get total count
    const totalCountPipeline = [
      ...pipeline.slice(0, -1), // Remove sort
      { $count: 'total' }
    ];

    const [transactions, totalResult] = await Promise.all([
      Transaction.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
      Transaction.aggregate(totalCountPipeline)
    ]);

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      errCode: 0,
      message: 'Get transactions successfully',
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error in getTransactions:', error);
    res.status(500).json({
      errCode: 1,
      message: error.message || 'Internal server error'
    });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller', status: 'active' })
      .select('_id username email')
      .sort({ username: 1 });

    res.status(200).json({
      errCode: 0,
      message: 'Get sellers successfully',
      data: sellers
    });
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      message: error.message
    });
  }
};

// ADMIN CATEGORY MANAGEMENT
export const getAdminCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const match = { isDeleted: false };
    if (search) {
      match.name = { $regex: search, $options: 'i' };
    }
    const total = await Category.countDocuments(match);
    const categories = await Category.find(match)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      errCode: 0,
      data: {
        categories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        filters: { search }
      }
    });
  } catch (error) {
    res.status(500).json({ errCode: 1, message: error.message });
  }
};

export const createAdminCategory = async (req, res) => {
  try {
    const { name, subcategories, description } = req.body;
    if (!name || !Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ errCode: 1, message: 'Tên và subcategories là bắt buộc' });
    }
    const exists = await Category.findOne({ name, isDeleted: false });
    if (exists) {
      return res.status(400).json({ errCode: 1, message: 'Tên danh mục đã tồn tại' });
    }
    const subArr = subcategories.map(sub => typeof sub === 'string' ? { name: sub } : sub);
    const category = await Category.create({ name, subcategories: subArr, description });
    res.status(201).json({ errCode: 0, message: 'Tạo danh mục thành công', category });
  } catch (error) {
    res.status(500).json({ errCode: 1, message: error.message });
  }
};

export const updateAdminCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, subcategories, description } = req.body;
    if (!name || !Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ errCode: 1, message: 'Tên và subcategories là bắt buộc' });
    }
    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      return res.status(404).json({ errCode: 1, message: 'Không tìm thấy danh mục' });
    }
    // Kiểm tra trùng tên (trừ chính nó)
    const exists = await Category.findOne({ name, _id: { $ne: categoryId }, isDeleted: false });
    if (exists) {
      return res.status(400).json({ errCode: 1, message: 'Tên danh mục đã tồn tại' });
    }
    const subArr = subcategories.map(sub => typeof sub === 'string' ? { name: sub } : sub);
    category.name = name;
    category.subcategories = subArr;
    category.description = description;
    await category.save();
    res.status(200).json({ errCode: 0, message: 'Cập nhật danh mục thành công', category });
  } catch (error) {
    res.status(500).json({ errCode: 1, message: error.message });
  }
};

export const deleteAdminCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      return res.status(404).json({ errCode: 1, message: 'Không tìm thấy danh mục' });
    }
    category.isDeleted = true;
    await category.save();
    res.status(200).json({ errCode: 0, message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ errCode: 1, message: error.message });
  }
};