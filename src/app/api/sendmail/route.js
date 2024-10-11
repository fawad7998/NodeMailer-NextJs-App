import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'salizahid75@gmail.com',
      subject: subject,
      html: `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #4CAF50; margin: 0;">New Contact Email</h1>
        </div>
        
        <!-- Email Info -->
        <p style="font-size: 16px; color: #555;">
          <strong style="color: #333;">From:</strong> ${email}
        </p>
        <p style="font-size: 16px; color: #555;">
          <strong style="color: #333;">Subject:</strong> ${subject}
        </p>
        
        <!-- Message Section -->
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-top: 20px; border-radius: 5px;">
          <p style="font-size: 16px; color: #555;">
            <strong style="color: #333;">Message:</strong>
          </p>
          <p style="font-size: 15px; line-height: 1.6;">${message}</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
          <p style="font-size: 12px; color: #888;">
            This email was sent from the contact form on your website.
          </p>
          <p style="font-size: 12px; color: #888;">
            &copy; 2024 Your Company | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send email.',
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
