import { useState } from "react";
import classes from "./style.module.css";
import Button from "../Button";

const MessageForm: React.FC<{
  onSubmit: (message: string) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
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
        Message à joindre (optionnel)
      </label>
      <textarea
        placeholder="Taper le message ici."
        className={classes["message-form__textarea"]}
        rows={10}
        cols={25}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && handleCancel()}
      />
      <div className="button-container">
        <Button fullWidth type="submit">
          Envoyer
        </Button>
        <Button variant="secondary" fullWidth onClick={handleCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
