import React from 'react';
import { func } from 'prop-types';
import bs from '../styles/bootstrap';


export default function SearchForm({
  handleSubmit,
}) {
  return (
    <form
      className={bs.formInline}
      onSubmit={handleSubmit}
    >
      <div
        className={[
          bs.formGroup,
          bs.hasFeedback,
        ].join(' ')}
      >
        <input
          placeholder="search"
          type="text"
          className={bs.formControl}
        />
        <span
          className={[
            bs.formControlFeedback,
            bs.glyphicon,
            bs.glyphiconSearch,
          ].join(' ')}
        />
      </div>
      <button
        type="submit"
        className={[bs.btn, bs.btnDefault].join(' ')}
      >
        Search
      </button>
    </form>
  );
}

SearchForm.propTypes = {
  handleSubmit: func.isRequired,
};
