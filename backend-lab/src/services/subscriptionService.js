import Inventory from '../models/inventory.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import cron from 'node-cron';

class SubscriptionService {
    
    // Khởi tạo cron jobs
    static initializeCronJobs() {
        // Kiểm tra tài khoản hết hạn mỗi giờ
        cron.schedule('0 * * * *', () => {
            this.processExpiredAccounts();
        });
        
        // Gửi thông báo sắp hết hạn mỗi ngày lúc 9:00
        cron.schedule('0 9 * * *', () => {
            this.notifyExpiringSoon();
        });
        
        console.log('Subscription cron jobs initialized');
    }
    
    // Xử lý tài khoản hết hạn
    static async processExpiredAccounts() {
        try {
            console.log('Processing expired accounts...');
            
            const expiredAccounts = await Inventory.findExpired();
            
            for (const account of expiredAccounts) {
                await this.expireAccount(account);
            }
            
            console.log(`Processed ${expiredAccounts.length} expired accounts`);
            
        } catch (error) {
            console.error('Error processing expired accounts:', error);
        }
    }
    
    // Hết hạn một tài khoản cụ thể
    static async expireAccount(account) {
        try {
            // Lưu thông tin revenue từ order
            if (account.currentSubscription.order) {
                const order = await Order.findById(account.currentSubscription.order);
                if (order) {
                    const historyIndex = account.usageHistory.length;
                    await account.expireSubscription();
                    
                    // Cập nhật revenue trong history
                    if (account.usageHistory[historyIndex]) {
                        account.usageHistory[historyIndex].revenue = order.total;
                        await account.save();
                    }
                }
            } else {
                await account.expireSubscription();
            }
            
            console.log(`Account ${account._id} expired and reset successfully`);
            
            // Gửi email thông báo cho khách hàng (nếu cần)
            await this.sendExpiryNotification(account);
            
        } catch (error) {
            console.error(`Error expiring account ${account._id}:`, error);
        }
    }
    
    // Thông báo tài khoản sắp hết hạn
    static async notifyExpiringSoon(hoursBeforeExpiry = 24) {
        try {
            const expiringAccounts = await Inventory.findExpiringSoon(hoursBeforeExpiry);
            
            for (const account of expiringAccounts) {
                await this.sendExpiryWarning(account);
            }
            
            console.log(`Sent expiry warnings for ${expiringAccounts.length} accounts`);
            
        } catch (error) {
            console.error('Error sending expiry notifications:', error);
        }
    }
    
    // Gia hạn tài khoản
    static async renewAccount(accountId, additionalDays, orderId) {
        try {
            const account = await Inventory.findById(accountId);
            if (!account) {
                throw new Error('Account not found');
            }
            
            if (!account.currentSubscription.isActive) {
                throw new Error('Account is not currently active');
            }
            
            await account.renewSubscription(additionalDays);
            
            // Cập nhật order reference nếu có
            if (orderId) {
                account.currentSubscription.order = orderId;
                await account.save();
            }
            
            console.log(`Account ${accountId} renewed for ${additionalDays} days`);
            return account;
            
        } catch (error) {
            console.error(`Error renewing account ${accountId}:`, error);
            throw error;
        }
    }
    
    // Bắt đầu subscription mới
    static async startNewSubscription(accountId, buyerId, orderId, duration) {
        try {
            const account = await Inventory.findById(accountId);
            if (!account) {
                throw new Error('Account not found');
            }
            
            if (account.status !== 'available') {
                throw new Error('Account is not available for purchase');
            }
            
            await account.startSubscription(buyerId, orderId, duration);
            
            console.log(`New subscription started for account ${accountId}`);
            return account;
            
        } catch (error) {
            console.error(`Error starting subscription for account ${accountId}:`, error);
            throw error;
        }
    }
    
    // Lấy thống kê subscription
    static async getSubscriptionStats(sellerId = null) {
        try {
            const matchCondition = sellerId ? { seller: sellerId } : {};
            
            const stats = await Inventory.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: null,
                        totalAccounts: { $sum: 1 },
                        availableAccounts: {
                            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
                        },
                        activeSubscriptions: {
                            $sum: { $cond: ['$currentSubscription.isActive', 1, 0] }
                        },
                        totalRevenueFromHistory: {
                            $sum: { $sum: '$usageHistory.revenue' }
                        },
                        averageUsageDuration: {
                            $avg: { $avg: '$usageHistory.duration' }
                        }
                    }
                }
            ]);
            
            return stats[0] || {
                totalAccounts: 0,
                availableAccounts: 0,
                activeSubscriptions: 0,
                totalRevenueFromHistory: 0,
                averageUsageDuration: 0
            };
            
        } catch (error) {
            console.error('Error getting subscription stats:', error);
            throw error;
        }
    }
    
    // Reset password thủ công
    static async manualPasswordReset(accountId) {
        try {
            const account = await Inventory.findById(accountId);
            if (!account) {
                throw new Error('Account not found');
            }
            
            if (account.accountType !== 'subscription') {
                throw new Error('Only subscription accounts can have password reset');
            }
            
            const newPassword = account.generateNewPassword();
            account.credentials.password = newPassword;
            account.autoReset.newPassword = newPassword;
            account.autoReset.lastResetDate = new Date();
            account.autoReset.resetCount += 1;
            
            await account.save();
            
            console.log(`Password reset for account ${accountId}`);
            return { newPassword, account };
            
        } catch (error) {
            console.error(`Error resetting password for account ${accountId}:`, error);
            throw error;
        }
    }
    
    // Gửi thông báo hết hạn
    static async sendExpiryNotification(account) {
        // TODO: Implement email notification
        console.log(`Expiry notification for account ${account._id} to user ${account.currentSubscription.buyer}`);
    }
    
    // Gửi cảnh báo sắp hết hạn
    static async sendExpiryWarning(account) {
        // TODO: Implement email notification
        console.log(`Expiry warning for account ${account._id} to user ${account.currentSubscription.buyer}`);
    }
}

export default SubscriptionService;
