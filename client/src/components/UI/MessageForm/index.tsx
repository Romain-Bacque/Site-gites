import { useState } from "react";
import classes from "./style.module.css";
import Button from "../Button";
import { useTranslation } from "react-i18next";

const MessageForm: React.FC<{
  onSubmit: (message: string) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  const handleCancel = () => {
    setMessage("");
    onCancel();
  };

  return (
    <form className={classes["message-form"]} onSubmit={handleSubmit}>
      <label style={{ fontWeight: 600 }} htmlFor="message-textarea">
        {t("messageForm.label")}
      </label>
      <textarea
        placeholder={t("messageForm.placeholder")}
        className={classes["message-form__textarea"]}
        rows={10}
        cols={25}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && handleCancel()}
      />
      <div className="button-container">
        <Button fullWidth type="submit">
          {t("common.send")}
        </Button>
        <Button variant="secondary" fullWidth onClick={handleCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
