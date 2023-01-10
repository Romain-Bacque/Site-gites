import emailjs from "emailjs-com";
export const emailHandler = {
  service: "service_3otfxmn",
  template: "template_ho0qxtr",
  userId: "user_I1HWuX9oE076hNrKEuHTK",
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
