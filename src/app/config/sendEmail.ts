import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import AppError from "../utils/AppError";
import { envVers } from "./env";

const transport = nodemailer.createTransport({
    service: "gmail", // Gmail হলে host/port auto set হবে
    auth: {
        user: envVers.EMAIL_SENDER.SMTP_USER,
        pass: envVers.EMAIL_SENDER.SMTP_PASS, // Gmail App Password দিতে হবে
    },
});

interface sendEmailsOptions {
    to: string;
    subject: string;
    templateName?: string;
    templateData?: Record<string, any>;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: sendEmailsOptions) => {
    try {
        const templatePath = path.resolve(__dirname, "templates", `${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData);

        const info = await transport.sendMail({
            from: envVers.EMAIL_SENDER.SMTP_USER,
            to,
            subject,
            html,
            attachments: attachments?.map((item) => ({
                filename: item.filename,
                content: item.content,
                contentType: item.contentType,
            })),
        });

        console.log(`/21131/ Email sent to ${to} : ${info.messageId}`);
    } catch (error) {
        console.error("Email Error:", error); // আসল error দেখাবে
        throw new AppError(400, "Email send failed.");
    }
};
