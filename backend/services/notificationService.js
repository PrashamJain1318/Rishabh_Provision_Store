const twilio = require('twilio');
const webpush = require('web-push');
const nodemailer = require('nodemailer');

// Twilio Setup (Mock Keys for MVP)
const twilioClient = twilio('AC_mock_account_sid', 'mock_auth_token');

// Web-Push Setup
// Generate VAPID keys using: npx web-push generate-vapid-keys
const publicVapidKey = 'BAmockPublicKey...';
const privateVapidKey = 'mockPrivateKey...';
webpush.setVapidDetails('mailto:support@rishabhstore.com', publicVapidKey, privateVapidKey);

class NotificationService {
  
  // 1. Send SMS (Twilio)
  async sendSMS(toPhone, message) {
    try {
      console.log(`[SMS] Sending to ${toPhone}: ${message}`);
      // await twilioClient.messages.create({ body: message, from: '+1234567890', to: toPhone });
      return true;
    } catch (err) {
      console.error('SMS Error:', err);
    }
  }

  // 2. Send WhatsApp (Twilio WhatsApp API)
  async sendWhatsApp(toPhone, message) {
    try {
      console.log(`[WhatsApp] Sending to ${toPhone}: ${message}`);
      // await twilioClient.messages.create({ body: message, from: 'whatsapp:+14155238886', to: `whatsapp:${toPhone}` });
      return true;
    } catch (err) {
      console.error('WhatsApp Error:', err);
    }
  }

  // 3. Send Web Push Notification
  async sendWebPush(subscription, title, body) {
    if (!subscription) return;
    try {
      const payload = JSON.stringify({ title, body, icon: '/icon.png' });
      console.log(`[Web Push] Sending to subscription endpoint...`);
      // await webpush.sendNotification(subscription, payload);
      return true;
    } catch (err) {
      console.error('Web Push Error:', err);
    }
  }

  // 4. Send Email
  async sendEmail(toEmail, subject, text) {
    try {
      console.log(`[Email] Sending to ${toEmail}: ${subject}`);
      // We already have emailService for invoices, but this is for generic alerts
      return true;
    } catch (err) {
      console.error('Email Error:', err);
    }
  }

  // 5. Orchestrator: Broadcast Order Update
  async broadcastOrderUpdate(user, order) {
    const message = `Hi ${user.name}, your Rishabh Store order ${order._id} is now ${order.status}!`;
    
    // Check Preferences and Fire
    const prefs = user.notificationPreferences;
    
    if (prefs?.sms && user.phone) {
      this.sendSMS(user.phone, message);
    }
    
    if (prefs?.whatsapp && user.phone) {
      this.sendWhatsApp(user.phone, message);
    }
    
    if (prefs?.push && user.pushSubscription) {
      this.sendWebPush(user.pushSubscription, `Order ${order.status}`, message);
    }
    
    if (prefs?.email && user.email) {
      this.sendEmail(user.email, `Order Update: ${order.status}`, message);
    }
  }
}

module.exports = new NotificationService();
