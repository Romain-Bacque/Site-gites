import emailjs from "emailjs-com";

export const emailHandler = {
  service: "",
  template: "",
  userId: "",
  sendEmail: async function (templateParams) {
    const response = await emailjs.send(
      this.service,
      this.template,
      templateParams,
      this.userId
    );

    return response.status;
  },
};
