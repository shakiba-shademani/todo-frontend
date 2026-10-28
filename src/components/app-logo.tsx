type AppLogoProps = {
  size?: number;
  withWordmark?: boolean;
};

export function Logo({ size = 72, withWordmark = false }: AppLogoProps) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div
        className='flex items-center justify-center rounded-[1.4rem] bg-primary shadow-lg shadow-blue-600/25'
        style={{ width: size, height: size }}
      >
        <svg viewBox='0 0 24 24' width={size * 0.52} height={size * 0.52} fill='none' aria-hidden>
          <path
            d='M5.5 12.5 10 17l8.5-10'
            stroke='white'
            strokeWidth='2.6'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      {withWordmark ? (
        <p className='text-2xl font-semibold tracking-tight text-foreground'>To Do</p>
      ) : null}
    </div>
  );
}
