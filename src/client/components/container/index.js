import React from 'react';
import bs from '../../styles/bootstrap';

export default function Container() {
  return (
    <div className={bs.container}>
      {this.props.children}
    </div>
  );
}
