const nodemailer = require('nodemailer');

// Set up a mock Ethereal Email service for development testing.
// In production, this would be SendGrid or AWS SES credentials from process.env
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Build simple HTML Invoice
    const htmlInvoice = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Rishabh Provision Store</h2>
        <h3>Order Confirmation - ${orderDetails._id}</h3>
        <p>Thank you for shopping with us! Your order has been placed successfully.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: right;">Total</th>
          </tr>
          ${orderDetails.items.map(item => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px;">${item.quantity}x (Product ID: ${item.productId})</td>
              <td style="padding: 10px; text-align: right;">₹${item.price * item.quantity}</td>
            </tr>
          `).join('')}
        </table>
        
        <h3 style="text-align: right; margin-top: 20px;">Final Total: ₹${orderDetails.totalAmount}</h3>
        
        <p><strong>Delivery Slot:</strong> ${orderDetails.deliverySlot}</p>
        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
        
        <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 30px 0;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated receipt from Rishabh Provision Store.</p>
      </div>
    `;

    let info = await transporter.sendMail({
      from: '"Rishabh Store" <orders@rishabhstore.com>',
      to: userEmail,
      subject: `Order Confirmed - ${orderDetails._id}`,
      html: htmlInvoice,
    });

    console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
  } catch (error) {
    console.error("Email Error:", error);
  }
};

module.exports = { sendOrderConfirmationEmail };
