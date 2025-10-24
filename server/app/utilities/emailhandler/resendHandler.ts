import { Resend } from "resend";
import ejs from "ejs";

interface EmailHandlerInitData {
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
      console.error(err);
      return null;
    }
  },

  /**
   * Method to send an email using Resend
   * @param data - contains the receiver name, its email address and a link to put in the email body
   */
  async sendEmail({ name, email: emailTo, link }: SendEmailData): Promise<any> {
    if (!emailHandler.emailFrom || !process.env.RESEND_API_KEY) {
      throw new Error(
        "Email handler not initialized or RESEND_API_KEY not set"
      );
    }

    const template = await emailHandler.createTemplate(name, link);
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // Resend SDK returns an object; pass from, to, subject, html
      const response = await resend.emails.send({
        from: emailHandler.emailFrom,
        to: [emailTo],
        subject: emailHandler.subject || "",
        html: template || "",
      });

      return response;
    } catch (err) {
      console.error("Resend send failed:", err);
      throw err;
    }
  },

  /**
   * Method to init email handler, must be called before all other email handler methods
   * @param data - contains the mail service, the sender email address and the subject of the email
   */
  init({ emailFrom, subject, template }: EmailHandlerInitData): void {
    emailHandler.emailFrom = emailFrom;
    emailHandler.subject = subject;
    emailHandler.template = template;
  },
};

export { emailHandler };
