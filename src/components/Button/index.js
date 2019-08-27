import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default function Button(props) {
  const { loading, ...rest } = props;
  return (
    <button {...rest}>
      {[
        loading ? (
          <div className="la-ball-spin-clockwise la-sm" key="la-first">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : null
      ].concat(props.children)}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  loading: PropTypes.bool
};
