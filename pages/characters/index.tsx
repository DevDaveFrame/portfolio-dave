import React from 'react';
import CharacterDetails from './CharacterDetails';
import { useFormControl, Validator, isRequired } from '../../hooks/useFormControl';

const Characters = () => {
  const requiredField = Validator(isRequired, 'This field is required');
  const {
    fields,
    setField,
    setValidators,
    setError,
    resetField,
    validateField,
    validateForm,
    resetForm,
  } = useFormControl([
    {
      fieldName: 'firstName',
      value: '',
      validators: [requiredField],
    },
    {
      fieldName: 'lastName',
      value: '',
      validators: [requiredField],
    },
    {
      fieldName: 'background',
      value: '',
      validators: [],
    },
    {
      fieldName: 'traits',
      value: '',
      validators: [],
    }
  ]);
  return (
    <div className="container">
      <h1>Characters</h1>
      <div className="screen">
        <div className="screen__menu">
          <div className="screen__menu__item">
            One
          </div>
          <div className="screen__menu__item">
            Two
          </div>
        </div>
        <div className="screen__display">
          <CharacterDetails
            fields={fields}
            setField={setField}
            validateField={validateField}
          />
        </div>
      </div>
    </div>
  );
}

export default Characters;