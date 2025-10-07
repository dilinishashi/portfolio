import { useRef, ReactNode, HTMLAttributes } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
}

const AnimatedCard = ({ children, className, delay = 0, ...props }: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0', // Start as invisible
        isVisible && 'animate-roll-in',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;