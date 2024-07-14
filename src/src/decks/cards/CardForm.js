// CardForm.js
import React from "react";

function CardForm({
  front,
  back,
  setFront,
  setBack,
  handleDone,
  handleSave,
  handleCancel,
}) {
  return (
    <form onSubmit={handleSave}>
      <div className="form-group">
        <label htmlFor="front">Front:</label>
        <br />
        <textarea
          className="form-control w-100"
          rows={2}
          id="front"
          name="front"
          placeholder="Front side of card"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="back">Back:</label>
        <br />
        <textarea
          className="form-control w-100"
          rows={2}
          id="back"
          name="back"
          placeholder="Back side of card"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
      </div>
      <br />
      <button
        type="button"
        className="btn btn-secondary mr-2"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
}

export default CardForm;
