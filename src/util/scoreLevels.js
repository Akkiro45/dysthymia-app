import { LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5 } from './color';

const LEVELS = [
  {
    startLimit: 0,
    endLimit: 4,
    msg1: 'Looks like you have been active.',
    msg2: 'Keep up the good work.',
    color: LEVEL1,
    emoji: 'slightly_smiling_face'
  },
  {
    startLimit: 5,
    endLimit: 9,
    msg1: 'Looks like you have been active.',
    msg2: 'Mild Depression',
    color: LEVEL2,
    emoji: 'disappointed'
  },
  {
    startLimit: 10,
    endLimit: 14,
    msg1: 'Looks like you have been active.',
    msg2: 'Moderate Depression',
    color: LEVEL3,
    emoji: 'cry'
  },
  {
    startLimit: 15,
    endLimit: 19,
    msg1: 'Looks like you have been active.',
    msg2: 'Moderately Severe Depression',
    color: LEVEL4,
    emoji: 'cold_sweat'
  },
  {
    startLimit: 20,
    endLimit: 24,
    msg1: 'Looks like you have been active.',
    msg2: 'Severe Depression',
    color: LEVEL5,
    emoji: 'persevere'
  }
];

export default LEVELS;