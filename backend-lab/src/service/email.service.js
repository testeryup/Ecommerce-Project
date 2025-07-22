import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

// ✅ Tạo transporter một lần
let transporter = null;

const createTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });
    }
    return transporter;
};

// ✅ EMAIL: Order confirmation với credentials only
export const sendOrderConfirmationEmail = async ({
    receiverEmail,
    buyerName,
    orderId,
    total,
    promoCode = null,
    saved = 0,
    credentials
}) => {
    try {
        const transporter = createTransporter();

        // ❌ XÓA PHẦN itemsHtml
        // const itemsHtml = items.map(item => `...`).join('');

        // ✅ CHỈ GIỮ LẠI credentialsHtml
        const credentialsHtml = credentials.map(cred => `
            <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin: 10px 0;">
                <h4 style="color: #495057; margin: 0 0 10px 0;">🎮 ${cred.skuId}</h4>
                <p style="margin: 5px 0;"><strong>Số lượng:</strong> ${cred.accounts.length || 0} tài khoản</p>
                <div style="background-color: #ffffff; border: 1px solid #ced4da; border-radius: 4px; padding: 10px; margin-top: 10px;">
                    ${cred.accounts.map((account, index) => `
                        <div style="border-bottom: 1px solid #e9ecef; padding: 8px 0; ${index === cred.accounts.length - 1 ? 'border-bottom: none;' : ''}">
                            <strong>Tài khoản ${index + 1}:</strong><br>
                            ${typeof account === 'object' ?
                Object.entries(account).map(([key, value]) =>
                    `<span style="color: #6c757d;">${key}:</span> <code style="background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${value}</code>`
                ).join(' | ') :
                `<code style="background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${account}</code>`
            }
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const mailOptions = {
            from: `"OCTOPUS 🐙" <${process.env.EMAIL_APP}>`,
            to: receiverEmail,
            subject: `🎉 Đơn hàng #${orderId} - Tài khoản đã sẵn sàng!`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">🎉 Đơn hàng thành công!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Cảm ơn bạn đã mua hàng tại Octopus</p>
                    </div>

                    <!-- Content -->
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333;">Xin chào <strong>${buyerName}</strong>,</p>
                        
                        <p style="color: #666; line-height: 1.6;">
                            Đơn hàng <strong style="color: #667eea;">#${orderId}</strong> của bạn đã được xử lý thành công! 
                            Dưới đây là tài khoản bạn đã mua.
                        </p>

                        <!-- ❌ XÓA TOÀN BỘ PHẦN ORDER SUMMARY TABLE -->
                        
                        <!-- Order Total Summary (Simple) -->
                        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                            ${promoCode ? `
                                <p style="margin: 5px 0; color: #28a745; font-size: 16px;">
                                    <strong>🎫 Mã giảm giá ${promoCode}:</strong> Tiết kiệm ${saved.toLocaleString('vi-VN')} VND
                                </p>
                            ` : ''}
                            <p style="margin: 10px 0; font-size: 20px; color: #dc3545;">
                                <strong>💰 Tổng thanh toán: ${total.toLocaleString('vi-VN')} VND</strong>
                            </p>
                        </div>

                        <!-- Credentials Section -->
                        <div style="margin: 30px 0;">
                            <h3 style="color: #495057; margin: 0 0 15px 0;">🔑 Tài khoản của bạn</h3>
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #856404;">
                                    <strong>⚠️ Quan trọng:</strong> Vui lòng lưu giữ thông tin tài khoản cẩn thận. 
                                    Không chia sẻ với người khác để tránh mất tài khoản.
                                </p>
                            </div>
                            
                            ${credentialsHtml}
                        </div>

                        <!-- Footer Notes -->
                        <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <h4 style="color: #1976d2; margin: 0 0 10px 0;">📝 Lưu ý quan trọng</h4>
                            <ul style="color: #424242; margin: 10px 0; padding-left: 20px;">
                                <li>Thông tin tài khoản đã được gửi qua email này</li>
                                <li>Bạn có thể xem lại đơn hàng trong phần "Lịch sử mua hàng"</li>
                                <li>Liên hệ support nếu gặp vấn đề với tài khoản</li>
                                <li>Không chia sẻ thông tin đăng nhập với người khác</li>
                                <li>Tài khoản có thể có thời hạn sử dụng, vui lòng kiểm tra</li>
                            </ul>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <p style="color: #666;">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!</p>
                            <p style="margin: 0;"><strong>Đội ngũ Octopus 🐙</strong></p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
                        <p style="margin: 0; font-size: 12px; color: #6c757d;">
                            Email này được gửi tự động từ hệ thống Octopus.<br>
                            Vui lòng không reply email này.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${receiverEmail}:`, info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error(`❌ Error sending order confirmation email to ${receiverEmail}:`, error);
        return { success: false, error: error.message };
    }
};

// ✅ Giữ lại function test
export const sendTestEmail = async ({ receiverEmail }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"OCTOPUS🐙" <${process.env.EMAIL_APP}>`,
            to: receiverEmail,
            subject: 'Bạn có tin nhắn mới từ Octopus',
            text: 'This is a test email sent using Nodemailer.',
            html: '<p>This is a test email sent using <b>Nodemailer</b>.</p>'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};
