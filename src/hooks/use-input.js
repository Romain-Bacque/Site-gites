import { useCallback, useReducer } from "react";

const initialState = {
  enteredValue: "",
  isValid: false,
  isTouched: false,
  passwordState: [],
};

const inputReducer = (state, action) => {
  if (action.type === "VALUE") {
    return { ...state, isValid: true, enteredValue: action.value };
  }
  if (action.type === "CHANGE") {
    switch (action.value.type) {
      case "text":
        if (action.value.value.length > 0) {
          return { ...state, isValid: true, enteredValue: action.value.value };
        }
        break;
      case "email":
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (action.value.value.match(mailformat)) {
          return { ...state, isValid: true, enteredValue: action.value.value };
        }
        break;
      case "number":
        if (action.value.value > 0 && action.value.value <= 4) {
          return { ...state, isValid: true, enteredValue: action.value.value };
        }
        break;
      case "tel":
        if (action.value.value >= 0) {
          return { ...state, isValid: true, enteredValue: action.value.value };
        }
        break;
      case "date":
        return { ...state, isValid: true, enteredValue: action.value.value };
      case "password":
        const passwordStateArray = [];
        const lowerCaseLetters = /[a-z]/g;
        const upperCaseLetters = /[A-Z]/g;
        const numbers = /[0-9]/g;

        if (action.value.value.length < 8) {
          passwordStateArray.push("- Au moin 8 caractères.");
        }
        if (!action.value.value.match(lowerCaseLetters)) {
          passwordStateArray.push("- Au moin 1 minuscule.");
        }
        if (!action.value.value.match(upperCaseLetters)) {
          passwordStateArray.push("- Au moin 1 majuscule.");
        }
        if (!action.value.value.match(numbers)) {
          passwordStateArray.push("- Au moin 1 chiffre.");
        }

        return {
          ...state,
          isValid: passwordStateArray.length > 0 ? false : true,
          enteredValue: action.value.value,
          passwordState: passwordStateArray,
        };
      case "textarea":
        return { ...state, enteredValue: action.value.value };
      default:
        console.log(`Sorry, we are out of ${action.value.type}.`);
    }
    return { ...state, isValid: false, enteredValue: action.value.value };
  }
  if (action.type === "BLUR") {
    return { ...state, isTouched: true };
  }
  if (action.type === "RESET") {
    return { ...initialState };
  }
  return state;
};

const useInput = () => {
  const [inputState, dispatch] = useReducer(inputReducer, initialState);

  const valueHandler = (value) => {
    dispatch({ type: "VALUE", value });
  };

  const changeHandler = (event) => {
    dispatch({ type: "CHANGE", value: event.target });
  };

  const blurHandler = (event) => {
    dispatch({ type: "BLUR", value: event.target });
  };

  const resetHandler = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    value: inputState.enteredValue,
    isValid: inputState.isValid,
    isTouched: inputState.isTouched,
    passwordState: inputState.passwordState,
    valueHandler,
    changeHandler,
    blurHandler,
    resetHandler,
  };
};

export default useInput;
