import type { CSSProperties } from 'react';

const shapes = {
  pizza: (
    <>
      <path d="M7 6Q20-1 33 6L20 35Z" />
      <path d="M7 6Q20 13 33 6" />
      <circle cx="18" cy="16" r="2" />
      <circle cx="23" cy="23" r="2" />
      <path d="m14 22 2 2" />
    </>
  ),
  xis: (
    <>
      <path d="M6 17C6 3 34 3 34 17Z" />
      <path d="m6 21 7 3 7-3 7 3 7-3M5 27h30M7 31q13 7 26 0" />
      <path d="m14 11 1 1m6-3 1 1m5 3 1 1" />
    </>
  ),
  calzone: (
    <>
      <path d="M5 25a15 15 0 0 1 30 0Z" />
      <path d="m8 25 2 3 3-3 3 3 4-3 4 3 3-3 3 3 2-3M14 17l2-3m4 3 2-3m4 5 2-3" />
    </>
  ),
  bottle: (
    <>
      <path d="M16 4h8v8l5 7v15a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V19l5-7ZM16 8h8M12 22h16M12 29h16" />
    </>
  ),
};

const decorations = [
  ['pizza', 5, 12, 38, 41, -8],
  ['bottle', 90, 8, 34, 49, -27],
  ['xis', 28, 6, 32, 55, -19],
  ['calzone', 72, 22, 46, 46, -32],
  ['pizza', 44, 36, 28, 58, -40],
  ['xis', 8, 53, 42, 50, -13],
  ['bottle', 53, 68, 36, 44, -29],
  ['calzone', 88, 57, 40, 60, -7],
  ['pizza', 22, 82, 48, 54, -22],
  ['xis', 74, 87, 32, 43, -36],
  ['bottle', 33, 52, 28, 62, -45],
  ['calzone', 62, 4, 35, 52, -16],
  ['pizza', 94, 84, 30, 48, -31],
  ['xis', 48, 93, 38, 57, -24],
  ['bottle', 3, 91, 32, 53, -41],
  ['calzone', 18, 28, 30, 47, -10],
  ['pizza', 14, 68, 34, 56, -18],
  ['xis', 84, 35, 36, 51, -34],
  ['bottle', 40, 17, 30, 59, -12],
  ['calzone', 64, 48, 38, 45, -26],
  ['pizza', 58, 80, 32, 61, -39],
  ['bottle', 92, 72, 34, 48, -21],
] as const;

export function FoodBackground() {
  return (
    <div className="food-background" aria-hidden="true">
      {decorations.map(([shape, x, y, size, duration, delay], index) => (
        <span
          key={index}
          className="food-background-icon"
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--travel-x': `${index % 2 ? -12 : 12}vw`,
              '--travel-y': `${index % 3 ? 16 : -16}vh`,
              '--rotation': `${index % 2 ? -28 : 28}deg`,
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            {shapes[shape]}
          </svg>
        </span>
      ))}
    </div>
  );
}
