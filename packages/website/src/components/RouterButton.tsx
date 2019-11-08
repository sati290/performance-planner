import React, { forwardRef } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Link, LinkProps } from 'react-router-dom';

type RouterButtonProps = ButtonProps & LinkProps;

const RouterButton: React.FC<RouterButtonProps> = props => {
  return (
    <Button
      component={forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
        <Link innerRef={ref} {...props} />
      ))}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default RouterButton;
