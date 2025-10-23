"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const emailHandler = {
    service: null,
    emailFrom: null,
    subject: null,
    template: null,
    /**
     * Method to create and return the html template of the email body
     * @param name - contains the receiver name
     * @param link - contains a link to put in the email body
     */
    async createTemplate(name, link) {
        try {
            if (!emailHandler.template)
                throw new Error("Template path not set");
            const html = await ejs_1.default.renderFile(emailHandler.template, {
                name,
                link,
            });
            return html;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    },
    /**
     * Method to send an email
     * @param data - contains the receiver name, its email address and a link to put in the email body
     */
    async sendEmail({ name, email: emailTo, link }) {
        if (!emailHandler.service || !emailHandler.emailFrom) {
            throw new Error("Email handler not initialized");
        }
        const transporter = nodemailer_1.default.createTransport({
            service: emailHandler.service,
            secure: process.env.NODE_ENV === "production",
            auth: {
                user: emailHandler.emailFrom,
                pass: process.env.APP_PASSWORD,
            },
        });
        // ✅ Verify transporter before sending
        try {
            await transporter.verify();
            console.log("✅ Transporter verified — ready to send emails.");
        }
        catch (verifyErr) {
            console.error("❌ Transporter verification failed:", verifyErr);
            throw new Error("SMTP transporter verification failed.");
        }
        const template = await emailHandler.createTemplate(name, link);
        const response = await transporter.sendMail({
            from: emailHandler.emailFrom,
            to: emailTo,
            subject: emailHandler.subject || "",
            html: template || "",
        });
        return response;
    },
    /**
     * Method to init email handler, must be called before all other email handler methods
     * @param data - contains the mail service, the sender email address and the subject of the email
     */
    init({ service, emailFrom, subject, template }) {
        emailHandler.service = service;
        emailHandler.emailFrom = emailFrom;
        emailHandler.subject = subject;
        emailHandler.template = template;
    },
};
exports.default = emailHandler;
