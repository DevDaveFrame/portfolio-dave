import { useReducer } from 'react';

export function useFormControl(controlsArray) {
  /* initialState is derived from the controlsArray
  controlsArray is an array of objects with the shape:
    {fieldName: string; !! Must match the 'name' property of the form field !!
    value: string | number | boolean,
    validators: []} */
  const initialState = controlsArray.reduce(
    (stateObject, control) => ({
      // stateObject is the accumulator object
      ...stateObject,
      [control.fieldName]: {
        value: control.value,
        touched: false,
        valid: !control?.validators?.length, // true if no validators
        errors: control?.validators?.length
          ? control.validators.map((validator) => validator(control.value))
          : [],
        validators: control.validators ?? [],
      },
    }),
    {} // stateObject
  );
  // dispatch for this reducer is private to the hook and should be wrapped by functions below.
  const [fields, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'INITIALIZE':
        return action.payload;
      case 'SET_FIELD':
        return {
          ...state,
          [action.payload.fieldName]: {
            ...state[action.payload.fieldName],
            ...action.payload.value,
          },
        };
      case 'SET_VALIDATORS':
        return {
          ...state,
          [action.payload.fieldName]: {
            ...state[action.payload.fieldName],
            validators: action.payload.validators,
          },
        };
      case 'RESET_FIELD':
        return {
          ...state,
          [action.payload.fieldName]: {
            ...state[action.payload.fieldName],
            value: initialState[action.payload.fieldName].value,
            touched: initialState[action.payload.fieldName].touched,
            valid: initialState[action.payload.fieldName].valid,
            errors: initialState[action.payload.fieldName].errors,
            validators: initialState[action.payload.fieldName].validators,
          },
        };
      default:
        return state;
    }
  }, initialState);
  // validateField is an event handler that validates and sets the value of a field.
  // Provide it to onChange or onBlur (or any other event) to validate during that change.
  const validateField = (event) => {
    const { name: fieldName, value } = event.target; // Destructure the event.
    if (!fields[fieldName]) {
      // Confirm that the field exists and throw an error if not.
      throw new Error(`Error in setField: '${fieldName}' is not a valid field`);
    }
    const { validators } = fields[fieldName]; // Get the validators array.
    const errors = validators.reduce(
      // Iterate over the validators array.
      (existingErrors, validator) => {
        // existingErrors is the accumulator array.
        const error = validator(value); // Run validators.
        if (error) {
          // If an error is returned, add it to the accumulator array.
          return [...existingErrors, error];
        }
        return existingErrors;
      },
      []
    );
    dispatch({
      // call dispatch to update the form in state
      type: 'SET_FIELD',
      payload: {
        fieldName,
        value: {
          value,
          touched: true,
          valid: errors.length === 0,
          errors,
        },
      },
    });
  };
  // setField is an onChange event handler that updates the value of the field without validating.
  const setField = (event) => {
    // eslint-disable-next-line object-curly-newline
    const { name: fieldName, value, type, checked } = event.target; // destructure the event.
    if (!fields[fieldName]) {
      // confirm that the field exists and throw an error if not.
      throw new Error(`Error in setField: '${fieldName}' is not a valid field`);
    }
    dispatch({
      type: 'SET_FIELD', // update the value of the form field to value, or checked if checkbox.
      payload: {
        fieldName,
        value: { value: type === 'checkbox' ? checked : value },
      },
    });
  };
  // setValidators allows us to change validations dynamically
  // (e.g., selecting one option sets another field to required).
  const setValidators = (fieldName, validators) => {
    if (!fields[fieldName]) {
      // confirm that the field exists and throw an error if not.
      throw new Error(`Error in setValidators: '${fieldName}' is not a valid field`);
    }
    dispatch({
      type: 'SET_VALIDATORS',
      payload: {
        fieldName,
        validators,
      },
    });
  };

  const setError = (fieldName, error) => {
    if (!fields[fieldName]) {
      // confirm that the field exists and throw an error if not.
      throw new Error(`Error in setValidators: '${fieldName}' is not a valid field`);
    }
    dispatch({
      // call dispatch to update the form in state
      type: 'SET_FIELD',
      payload: {
        fieldName,
        value: {
          value: fields[fieldName].value,
          touched: true,
          valid: false,
          errors: [error],
        },
      },
    });
  };

  // resetField wraps dispatch to reset a field to its initial state
  const resetField = (fieldName) => {
    dispatch({
      type: 'RESET_FIELD',
      payload: { fieldName },
    });
  };
  // resetForm wraps dispatch to reset the whole form to its initial state
  const resetForm = () => {
    dispatch({
      type: 'INITIALIZE',
      payload: initialState,
    });
  };
  // validateForm updates validity in state & returns true if all fields are valid; false otherwise.
  const validateForm = () => {
    let valid = true;
    Object.keys(fields).forEach((fieldName) => {
      // iterate over all the keys in state
      const { validators } = fields[fieldName]; // get the validators array
      const errors = validators.reduce(
        // iterate over the validators array
        (existingErrors, validator) => {
          // existingErrors is the accumulator array
          const error = validator(fields[fieldName].value); // run validators
          if (error) {
            // if an error is returned, add it to the accumulator array
            return [...existingErrors, error];
          }
          return existingErrors;
        },
        []
      );
      dispatch({
        type: 'SET_FIELD',
        payload: {
          fieldName,
          value: {
            ...fields[fieldName],
            touched: true,
            valid: errors.length === 0,
            errors,
          },
        },
      });
      if (valid && errors.length) valid = false;
    });
    return valid;
  };

  return {
    fields,
    setField,
    setValidators,
    setError,
    resetField,
    validateField,
    validateForm,
    resetForm,
  };
}

// Validator is a HOC that takes any boolean-returning callback and an error object/string/number
// It returns an error of the specified type/shape if the callback returns false
export const Validator = (callback, error) => {
  return (value) => {
    return !callback(value) ? error : null;
  };
};
// isRequired is a really simple example of a potential Validator callback
export const isRequired = (value) => !!value;
// validateEmailFormat had been duplicated in a few places, so I gave it a new home here
export const validateEmailFormat = (em) => {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(em);
};
