import {ses} from "../../index";

type Language = "de" | "en" | "tr";

interface EmailContent {
    subject: string;
    heading: string;
    paragraph: string;
    linkText: string;
    ignoreText: string;
}

const emailContent: Record<Language, EmailContent> = {
    de: {
        subject: "Bestätigen Sie Ihre neue E-Mail-Adresse",
        heading: "E-Mail-Adresse bestätigen",
        paragraph: "Bitte klicken Sie auf den folgenden Link, um Ihre neue E-Mail-Adresse zu bestätigen:",
        linkText: "E-Mail bestätigen",
        ignoreText: "Dies ist eine automatisierte Nachricht. Bitte antworten Sie nicht auf diese E-Mail.\n" +
            "Wenn Sie dies nicht angefordert haben, können Sie diese E-Mail ignorieren."
    },
    en: {
        subject: "Confirm Your New Email Address",
        heading: "Confirm Email Address",
        paragraph: "Please click the following link to confirm your new email address:",
        linkText: "Confirm Email",
        ignoreText: "This is an automated message. Please do not reply to this email.\n" +
            "If you didn't request this, you can safely ignore this email."
    },
    tr: {
        subject: "Yeni E-posta Adresinizi Onaylayın",
        heading: "E-posta Adresini Onayla",
        paragraph: "Yeni e-posta adresinizi onaylamak için lütfen aşağıdaki bağlantıya tıklayın:",
        linkText: "E-postayı Onayla",
        ignoreText: "Bu bir otomatik mesajdır. Lütfen bu e-postayı yanıtlamayın.\n" +
            "Eğer bu isteğiniz değilseniz, bu e-postayı güvenli olarak yok sayabilirsiniz."
    }
};

export async function sendConfirmationEmail(email: string, token: string, language: Language) {
    const confirmationLink = `https://salah.tv/confirm-email?token=${token}`;
    const content = emailContent[language];

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="${language}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${content.subject}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50;">SALAH.TV</h1>
                    <h2 style="color: #2c3e50;">${content.heading}</h2>
                    <p>${content.paragraph}</p>
                    <a href="${confirmationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">${content.linkText}</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">${content.ignoreText}</p>
                </div>
            </body>
        </html>
    `;

    const textContent = `
        ${content.heading}

        ${content.paragraph}

        ${confirmationLink}

        ${content.ignoreText}
    `;

    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlContent
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textContent
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: content.subject
            }
        },
        Source: "noreply@salah.tv",
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send confirmation email to ${email}:`, error);
        throw error;
    }
}
