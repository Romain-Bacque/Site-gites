import { forwardRef, useImperativeHandle, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./style.module.css";

interface CaptchaProps {
  onChange: (value: string | null) => void;
}

const Captcha = forwardRef<{ reset: () => void }, CaptchaProps>(
  ({ onChange }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      },
    }));

    return (
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ""}
        className={styles.reCaptcha}
        size="normal"
        onChange={onChange}
      />
    );
  }
);

export default Captcha;
