interface LotusIconProps {
  className?: string;
}

export function LotusIcon({ className = 'w-8 h-8' }: LotusIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Center petal */}
      <path
        d="M32 13C26.5 22 25 32.5 32 43C39 32.5 37.5 22 32 13Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner left petal */}
      <path
        d="M27.5 42.5C19 37 16.5 27.5 20 19.5C24.5 23 27.5 29.5 28.5 38"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner right petal */}
      <path
        d="M36.5 42.5C45 37 47.5 27.5 44 19.5C39.5 23 36.5 29.5 35.5 38"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer left petal */}
      <path
        d="M24 44C14.5 42.5 9.5 36.5 10 29.5C14.5 30.5 19.5 34.5 22.5 40.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer right petal */}
      <path
        d="M40 44C49.5 42.5 54.5 36.5 54 29.5C49.5 30.5 44.5 34.5 41.5 40.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gentle resting base line */}
      <path
        d="M19 48.5C23.5 50.2 27.8 51 32 51C36.2 51 40.5 50.2 45 48.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
