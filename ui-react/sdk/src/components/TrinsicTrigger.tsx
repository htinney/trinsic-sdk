import React from 'react';
import { useTrinsic } from '../context/TrinsicContext';
import type { LaunchMode } from '../types';

interface TrinsicTriggerBaseProps {
  sessionUrl?: string;
  redirectUrl?: string;
  exchangeUrl?: string;
  mode?: LaunchMode;
  disabled?: boolean;
  onClick?: (result: any) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

interface TrinsicTriggerAsChildProps extends TrinsicTriggerBaseProps {
  asChild: true;
  children: React.ReactElement;
}

interface TrinsicTriggerButtonProps extends TrinsicTriggerBaseProps {
  asChild?: false;
  children?: React.ReactNode;
}

type TrinsicTriggerProps = TrinsicTriggerAsChildProps | TrinsicTriggerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TrinsicTrigger: React.FC<TrinsicTriggerProps> = ({
  sessionUrl,
  redirectUrl,
  exchangeUrl,
  mode = 'popup',
  asChild = false,
  children,
  disabled = false,
  onClick,
  ...props
}) => {
  // Only pass options if any are provided, otherwise use provider defaults
  const options = (sessionUrl || redirectUrl || exchangeUrl) ? 
    { sessionUrl, redirectUrl, exchangeUrl } : 
    undefined;
  
  // Use the unified hook with mode and optional options
  const { launch, isLoading } = useTrinsic(mode, options);

  // If asChild is true, clone the child and pass the trigger props
  if (asChild) {
    if (!children || !React.isValidElement(children)) {
      throw new Error('TrinsicTrigger with asChild requires a single valid React element as children');
    }

    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      onClick: (e: any) => {
        // Call the original onClick if it exists
        (children as React.ReactElement<any>).props.onClick?.(e);
        // Call our launch handler
        launch();
      },
      disabled: disabled || isLoading || (children as React.ReactElement<any>).props.disabled,
    });
  }

  // Default button rendering when asChild is false - completely unstyled
  return (
    <button
      onClick={launch}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      disabled={disabled || isLoading}
    >
      {children}
    </button>
  );
};