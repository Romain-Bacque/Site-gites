import nodemailer from "nodemailer";
import ejs from "ejs";

interface EmailHandlerInitData {
  service: string;
  emailFrom: string;
  subject: string;
  template: string;
}

interface SendEmailData {
  name: string;
  email: string;
  link: string;
}

const emailHandler = {
  service: null as string | null,
  emailFrom: null as string | null,
  subject: null as string | null,
  template: null as string | null,

  /**
   * Method to create and return the html template of the email body
   * @param name - contains the receiver name
   * @param link - contains a link to put in the email body
   */
  async createTemplate(name: string, link: string): Promise<string | null> {
    try {
      if (!emailHandler.template) throw new Error("Template path not set");
      const html = await ejs.renderFile(emailHandler.template, {
        name,
        link,
      });
      return html;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  /**
   * Method to send an email
   * @param data - contains the receiver name, its email address and a link to put in the email body
   */
  async sendEmail({ name, email: emailTo, link }: SendEmailData): Promise<any> {
    if (!emailHandler.service || !emailHandler.emailFrom) {
      throw new Error("Email handler not initialized");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS port
      secure: false,
      auth: {
        user: emailHandler.emailFrom,
        pass: process.env.APP_PASSWORD,
      },
    });

    // ✅ Verify transporter before sending
    try {
      await transporter.verify();
      console.log("✅ Transporter verified — ready to send emails.");
    } catch (verifyErr) {
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
  init({ service, emailFrom, subject, template }: EmailHandlerInitData): void {
    emailHandler.service = service;
    emailHandler.emailFrom = emailFrom;
    emailHandler.subject = subject;
    emailHandler.template = template;
  },
};

export default emailHandler;
