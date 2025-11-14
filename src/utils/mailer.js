
const crypto = require("crypto");
const nodemailer = require("nodemailer");

    async function sendResetPasswordEmail(user) {
        const { PasswordResetService } = require("../services");
        const passwordResetData = {
            email: user.email, 
            token: crypto.randomBytes(8).toString("hex")
        }

        const passwordReset = await PasswordResetService.create(passwordResetData);

        const resetLink = `http://localhost:8080/reset-password/${passwordResetData.token}`;

        let transporter = nodemailer.createTransport({
            host: "in-v3.mailjet.com", // Replace with your SMTP host
            port: 587, // Or 465 for SMTPS
            secure: false, // true for 465, false for other ports
            auth: {
                user: "a21700bdfb9870a4899bd27e403e1852", // Your email address
                pass: "6e79a58d2a2cc58cb97a333e0888416b", // Your email password or app password
            },
        });

        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="pt-br"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Redefinição de Senha</title>
            <style>body{font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f7;margin:0;padding:0;}
            .container{max-width:600px;margin:40px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
            .header{background-color:#0b57d0;color:#ffffff;text-align:center;padding:20px;}
            .header h1{margin:0;font-size:22px;}
            .content{padding:30px;color:#333;line-height:1.6;}
            .content p{margin-bottom:16px;}
            .button{display:inline-block;background-color:#0b57d0;color:#fff!important;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;}
            .footer{font-size:12px;text-align:center;color:#888;padding:20px;}
            </style></head>
            <body><div class="container"><div class="header"><h1>Tales Ludos</h1></div><div class="content">
            <h2>Redefinição de Senha</h2><p>Olá,</p>
            <p>Recebemos um pedido para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
            <p style="text-align:center;"><a href="${resetLink}" class="button">Redefinir Senha</a></p>
            <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break:break-all;color:#0b57d0;">${resetLink}</p>
            <p>Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
            <p>Este link expira em 30 minutos.</p></div>
            <div class="footer">© ${new Date().getFullYear()} Tales Ludos. Todos os direitos reservados.</div></div></body></html>
        `;

        const info = await transporter.sendMail({
            from: '"Servidor Local" <alves2075@gmail.com>',
            to: passwordResetData.email,
            subject: "Recuperação de Senha",
            html: htmlTemplate,
        });

        console.log("Email enviado (capturado pelo MailDev):", info.messageId);
    }


module.exports = { sendResetPasswordEmail };