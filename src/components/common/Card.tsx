import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Card variants
export type CardVariant = 'default' | 'elevated' | 'outlined';

// Card padding sizes
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

// Card props interface
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

// Variant styles
const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white',
  elevated: 'bg-white shadow-lg',
  outlined: 'border-2 border-gray-200',
};

// Padding styles
const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

// Interactive styles
const interactiveStyles = {
  default: 'hover:shadow-md transition-shadow duration-200 cursor-pointer',
  elevated: 'hover:shadow-xl transition-shadow duration-200 cursor-pointer',
  outlined: 'hover:border-primary-400 transition-colors duration-200 cursor-pointer',
};

// Card component
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      interactive = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl',

          // Variant styles
          variantStyles[variant],

          // Padding styles
          paddingStyles[padding],

          // Interactive styles
          interactive && interactiveStyles[variant],

          // Custom className
          className
        )}
        {...(rest as React.ComponentProps<'div'>)}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
