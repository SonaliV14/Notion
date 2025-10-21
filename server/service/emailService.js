import nodemailer from 'nodemailer';
import crypto from 'crypto';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  generateInviteToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendCollaborationInvite({ 
    recipientEmail, 
    recipientName,
    inviterName, 
    pageTitle, 
    role, 
    inviteToken,
    pageId 
  }) {
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${inviteToken}`;
    
    const mailOptions = {
      from: `"NoteHub" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `${inviterName} invited you to collaborate on "${pageTitle}" in NoteHub`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Invited to Collaborate!</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName || 'there'},</p>
              <p><strong>${inviterName}</strong> has invited you to collaborate on a page in NoteHub:</p>
              
              <div class="info-box">
                <h3 style="margin: 0 0 10px 0;">📄 ${pageTitle}</h3>
                <p style="margin: 0; color: #6b7280;">Role: <strong>${role.charAt(0).toUpperCase() + role.slice(1)}</strong></p>
              </div>

              <p>As a <strong>${role}</strong>, you will be able to:</p>
              <ul>
                ${role === 'viewer' ? '<li>View the page content</li>' : ''}
                ${role === 'editor' ? '<li>Edit and update the page</li><li>Add and modify content</li>' : ''}
              </ul>

              <div style="text-align: center;">
                <a href="${inviteUrl}" class="button">Accept Invitation</a>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                This invitation will expire in 7 days.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} NoteHub. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();