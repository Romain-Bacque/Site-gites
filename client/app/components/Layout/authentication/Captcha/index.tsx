import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./style.module.css";

interface CaptchaProps {
  onChange: (value: string | null) => void;
}

const BREAKPOINT_PX = 480; // change breakpoint as needed

const Captcha = forwardRef<{ reset: () => void }, CaptchaProps>(
  ({ onChange }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const getInitialSize = (): "normal" | "compact" =>
      typeof window !== "undefined" && window.innerWidth <= BREAKPOINT_PX
        ? "compact"
        : "normal";

    const [size, setSize] = useState<"normal" | "compact">(getInitialSize);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const mq = window.matchMedia(`(max-width: ${BREAKPOINT_PX}px)`); // matchMedia is used to listen for changes in viewport size
      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        setSize(e.matches ? "compact" : "normal");
      };
      // initialize
      handler(mq);
      if (mq.addEventListener) {
        mq.addEventListener("change", handler as EventListener);
      } else {
        // fallback for older browsers
        mq.addListener(handler);
      }
      return () => {
        if (mq.removeEventListener) {
          mq.removeEventListener("change", handler as EventListener);
        } else {
          mq.removeListener(handler);
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      },
    }));

    return (
      // force remount when size changes by using key
      <ReCAPTCHA
        key={size}
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        className={styles.reCaptcha}
        size={size}
        onChange={onChange}
      />
    );
  },
);

Captcha.displayName = "Captcha";

export default Captcha;
