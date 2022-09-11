import React from "react";
import { useFormControl, Validator, isRequired } from "../../hooks/useFormControl";

export default function CharacterDetails({
  fields,
  setField,
  validateField,
}) {
  const {firstName, lastName, background, traits} = fields;
  return (
    <form>
      <div className="form-group">
        <label htmlFor="firstName">First Name: </label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          placeholder="Enter first name"
          value={firstName.value}
          onChange={setField}
          onBlur={validateField}
        />
        <label htmlFor="lastName">Last Name: </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          name="lastName"
          placeholder="Enter last name"
          value={lastName.value}
          onChange={setField}
          onBlur={validateField}
        />
      </div>
      <div className="form-group">
        <label htmlFor="background">Background: </label>
        <textarea
          className="form-control"
          id="background"
          name="background"
          rows={3}
          value={background.value}
          onChange={setField}
          onBlur={validateField}
        />
      </div>
      <div className="form-group">
        <label htmlFor="traits">Traits: </label>
        <textarea
          className="form-control"
          id="traits"
          name="traits"
          rows={3}
          value={traits.value}
          onChange={setField}
          onBlur={validateField}
        />
      </div>
    </form>
  );
}