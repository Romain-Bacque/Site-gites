import { useCallback, useReducer } from "react";

// enum
enum InputStateKind {
  VALUE,
  CHANGE,
  BLUR,
  RESET,
}

// interfaces
interface InputState {
  enteredValue: string;
  isValid: boolean;
  isTouched: boolean;
  passwordState: string[];
}

interface InputAction {
  type: InputStateKind;
  value?: HTMLInputElement | string;
}

// ---

const initialState = {
  enteredValue: "",
  isValid: false,
  isTouched: false,
  passwordState: [],
};

const inputReducer = (state: InputState, action: InputAction): InputState => {
  if (
    action.type === InputStateKind.VALUE &&
    typeof action.value === "string"
  ) {
    return { ...state, isValid: true, enteredValue: action.value };
  }
  if (action.type === InputStateKind.CHANGE) {
    const actionValue = action.value as HTMLInputElement;

    switch (actionValue.type) {
      case "text":
        if (action.value && actionValue.value.length > 0) {
          return { ...state, isValid: true, enteredValue: actionValue.value };
        }
        break;
      case "email":
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (actionValue.value.match(mailformat)) {
          return { ...state, isValid: true, enteredValue: actionValue.value };
        }
        break;
      case "number":
        if (Number(actionValue.value) > 0 && Number(actionValue.value) <= 4) {
          return { ...state, isValid: true, enteredValue: actionValue.value };
        }
        break;
      case "tel":
        if (Number(actionValue.value) >= 0) {
          return { ...state, isValid: true, enteredValue: actionValue.value };
        }
        break;
      case "date":
        return { ...state, isValid: true, enteredValue: actionValue.value };
      case "password":
        const passwordStateArray: string[] = [];
        const lowerCaseLetters = /[a-z]/g;
        const upperCaseLetters = /[A-Z]/g;
        const numbers = /[0-9]/g;

        if (actionValue.value.length < 8) {
          passwordStateArray.push("- Au moin 8 caractères.");
        }
        if (!actionValue.value.match(lowerCaseLetters)) {
          passwordStateArray.push("- Au moin 1 minuscule.");
        }
        if (!actionValue.value.match(upperCaseLetters)) {
          passwordStateArray.push("- Au moin 1 majuscule.");
        }
        if (!actionValue.value.match(numbers)) {
          passwordStateArray.push("- Au moin 1 chiffre.");
        }

        return {
          ...state,
          isValid: passwordStateArray.length > 0 ? false : true,
          enteredValue: actionValue.value,
          passwordState: passwordStateArray,
        };
      case "textarea":
        return { ...state, enteredValue: actionValue.value };
      default:
        console.log(`Sorry, we are out of ${actionValue.type}.`);
    }
    return { ...state, isValid: false, enteredValue: actionValue.value };
  }
  if (action.type === InputStateKind.BLUR) {
    return { ...state, isTouched: true };
  }
  if (action.type === InputStateKind.RESET) {
    return { ...initialState };
  }
  return state;
};

const useInput = () => {
  const [inputState, dispatch] = useReducer(inputReducer, initialState);

  const valueHandler = (value: string) => {
    dispatch({ type: InputStateKind.VALUE, value });
  };

  const changeHandler = (event: React.ChangeEvent) => {
    dispatch({
      type: InputStateKind.CHANGE,
      value: event.target as HTMLInputElement,
    });
  };

  const blurHandler = (event: React.FocusEvent) => {
    dispatch({
      type: InputStateKind.BLUR,
      value: event.target as HTMLInputElement,
    });
  };

  const resetHandler = useCallback(() => {
    dispatch({ type: InputStateKind.RESET });
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