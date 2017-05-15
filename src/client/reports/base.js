import React from 'react';
import { string, node } from 'prop-types';

export default function ReportBase({
  title,
  children,
}) {
  return (
    <html lang="en-US">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
ReportBase.propTypes = {
  title: string.isRequired,
  children: node.isRequired,
};
