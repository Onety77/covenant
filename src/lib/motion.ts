/**
 * Motion tokens. One personality: precise, calm, confident. Things arrive quickly and
 * settle without bounce; only live things keep moving (prices, clocks, the ticker, the
 * verdict in progress). Everything respects reduced motion via <MotionConfig>.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const // entrances (expo-out)
export const EASE_UI = [0.25, 1, 0.5, 1] as const // UI state changes (quart-out)
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const // things that travel across the screen
export const SPRING_UI = { type: 'spring', stiffness: 520, damping: 42 } as const // indicators that slide
export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 30 } as const // panels
