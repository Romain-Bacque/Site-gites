import classes from "./Input.module.css";

const Input = (props) => {
  const handleInputClick = (event) => {
    if (event.target.type === "date") {
      event.stopPropagation();
      event.preventDefault();

      props.onInputDateClick();
    }
  };

  return (
    <>
      <div>
        {props.visible && (
          <label className={classes.form__label} htmlFor={props.input.id}>
            {props.label}
          </label>
        )}
        {props.forgotPassword && props.forgotPassword}
      </div>
      <input
        onClick={handleInputClick}
        className={`${classes.form__input} ${classes[props.className]}`}
        {...props.input}
      />
    </>
  );
};

export default Input;
