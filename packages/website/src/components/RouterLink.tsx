import React, { forwardRef } from 'react';
import { Link as MaterialLink } from '@material-ui/core';
import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';
import { Link, LinkProps } from 'react-router-dom';

type RouterLinkProps = MaterialLinkProps & LinkProps;

const RouterLink: React.FC<RouterLinkProps> = props => {
  return (
    <MaterialLink
      component={forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
        <Link innerRef={ref} {...props} />
      ))}
      {...props}
    >
      {props.children}
    </MaterialLink>
  );
};

export default RouterLink;
