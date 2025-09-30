import emailjs from "emailjs-com";
export const emailHandler = {
  service: process.env.SERVICE as string,
  template: process.env.TEMPLATE as string,
  userId: process.env.USER_ID as string,
  async sendEmail(templateParams: Record<string, string> | undefined) {
    const response = await emailjs.send(
      this.service,
      this.template,
      templateParams,
      this.userId
    );

    return response;
  },
};
