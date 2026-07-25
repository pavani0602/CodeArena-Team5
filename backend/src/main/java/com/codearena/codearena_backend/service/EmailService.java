package com.codearena.codearena_backend.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:CodeArena}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(String to, String username) {
        if (mailSender == null) {
            logger.warn("JavaMailSender is not configured. Welcome email to {} was not sent. Ensure spring.mail properties are set.", to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to CodeArena, " + username + "!");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333333;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f5f7;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        }
                        .header {
                            background-color: #0d1117;
                            padding: 40px 20px;
                            text-align: center;
                            border-bottom: 4px solid #00ff88;
                        }
                        .logo-text {
                            font-size: 32px;
                            font-weight: 800;
                            letter-spacing: 4px;
                            margin: 0;
                        }
                        .logo-text .code {
                            color: #ffffff;
                        }
                        .logo-text .arena {
                            color: #00ff88;
                        }
                        .logo-sub {
                            color: #8b949e;
                            font-size: 12px;
                            letter-spacing: 2px;
                            margin-top: 10px;
                        }
                        .content {
                            padding: 40px 40px 20px 40px;
                        }
                        h1 {
                            color: #0d1117;
                            font-size: 24px;
                            margin-top: 0;
                        }
                        p {
                            font-size: 16px;
                            color: #4b5563;
                            margin-bottom: 20px;
                        }
                        .quick-tip {
                            background-color: #f0fdf4;
                            border-left: 4px solid #00ff88;
                            padding: 20px;
                            border-radius: 0 8px 8px 0;
                            margin: 30px 0;
                        }
                        .quick-tip h3 {
                            margin: 0 0 10px 0;
                            color: #166534;
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        .quick-tip p {
                            margin: 0;
                            font-size: 15px;
                            color: #15803d;
                        }
                        .footer {
                            background-color: #f9fafb;
                            padding: 20px;
                            text-align: center;
                            font-size: 13px;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo-text">
                                <span class="code">CODE</span> <span class="arena">ARENA</span>
                            </div>
                            <div class="logo-sub">CODE. SOLVE. COMPETE. LEVEL UP.</div>
                        </div>
                        <div class="content">
                            <h1>Hi %s, 👋</h1>
                            
                            <p>We're so glad you found us, and we're confident this is the start of a long-lasting programming journey. (Spoiler: Just like your new relationship with algorithms!)</p>
                            
                            <p>You might be feeling some nervous butterflies about your next coding challenge, but consider this your fresh start. Don't worry, we'll be with you every step of the way to level up your skills.</p>
                            
                            <div class="quick-tip">
                                <h3>💡 Quick Tip</h3>
                                <p>Want to build your problem-solving foundation? Jump into the Global Arena and start with the <strong>Easy</strong> difficulty problems to get your first successful compilation!</p>
                            </div>
                            
                            <p>Happy Coding,<br><strong>The Code Arena Team</strong></p>
                        </div>
                        <div class="footer">
                            &copy; 2026 Code Arena. All rights reserved.<br>
                            You received this email because you recently signed up for a Code Arena account.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(username);

            helper.setText(htmlContent, true); // true indicates HTML content

            mailSender.send(message);
            logger.info("Welcome HTML email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send welcome HTML email to {}: {}", to, e.getMessage());
        }
    }
}
