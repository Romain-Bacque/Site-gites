import { recaptchaRequest } from "../lib/api";
import { useState } from "react";

const useRecaptcha = () => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  async function verifyCaptcha() {
    try {
      if (!captchaValue) {
        return false;
      }

      const response = await recaptchaRequest({ recaptchaToken: captchaValue });

      if (response?.data?.error) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error verifying captcha:", error);
      return false;
    }
  }

  return {
    captchaValue,
    setCaptchaValue,
    verifyCaptcha,
  };
};

export default useRecaptcha;
