export const cardSnapMotion = {
  activeTransform: 'scale(1)',
  scrollingTransform: 'scale(0.99)',
  tracking: {
    duration: 0.16,
    ease: [0.23, 1, 0.32, 1] as const,
  },
  settle: {
    type: 'spring' as const,
    duration: 0.5,
    bounce: 0.2,
  },
  instant: {
    duration: 0,
  },
}
