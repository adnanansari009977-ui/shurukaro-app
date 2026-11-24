import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'subtle';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...rest
}) => {
  const base =
    'min-h-[48px] px-5 py-3 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants: Record<NonNullable<PrimaryButtonProps['variant']>, string> = {
    primary: 'bg-[#0F766E] text-white hover:bg-[#0D5E58] shadow-sm',
    accent: 'bg-[#EA580C] text-white hover:bg-[#C2410C] shadow-sm',
    outline:
      'bg-white text-[#111827] border border-[#D1D5DB] hover:bg-[#F9FAFB]',
    subtle:
      'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4]',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
