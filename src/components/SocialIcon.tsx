import React from 'react';
import * as Icons from 'lucide-react';

// This defines the type for our icon names based on what's available in lucide-react
type IconName = keyof typeof Icons;

interface SocialIconProps {
  name: IconName;
  [key: string]: any; // Allows passing other props like className, size, etc.
}

const SocialIcon = ({ name, ...props }: SocialIconProps) => {
  const LucideIcon = Icons[name];

  // If an icon name is invalid, we'll show a fallback question mark icon
  if (!LucideIcon) {
    return <Icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default SocialIcon;