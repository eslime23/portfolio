export const cardSnapMotion = {
  activeTransform: 'scale(1)',
  inactiveTransform: 'scale(0.985)',
  spring: {
    type: 'spring' as const,
    duration: 0.5,
    bounce: 0.2,
  },
  instant: {
    duration: 0,
  },
}
