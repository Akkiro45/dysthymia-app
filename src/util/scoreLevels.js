import { LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5 } from './color';

const LEVELS = [
  {
    startLimit: 0,
    endLimit: 4,
    msg1: 'Looks like you have been active.',
    msg2: 'Keep up the good work!',
    color: LEVEL1,
    emoji: 'slightly_smiling_face'
  },
  {
    startLimit: 5,
    endLimit: 9,
    msg1: 'One step away from perfect mental health.',
    msg2: 'Always have good health.',
    color: LEVEL2,
    emoji: 'disappointed'
  },
  {
    startLimit: 10,
    endLimit: 14,
    msg1: 'Improve your health. Be Active!',
    msg2: 'Shake it up!',
    color: LEVEL3,
    emoji: 'cry'
  },
  {
    startLimit: 15,
    endLimit: 19,
    msg1: 'The power to heal is in you.',
    msg2: 'Commit to be Fit!',
    color: LEVEL4,
    emoji: 'cold_sweat'
  },
  {
    startLimit: 20,
    endLimit: 24,
    msg1: 'Put efforts on physical and social life.',
    msg2: 'Stay Strong, Live Long!',
    color: LEVEL5,
    emoji: 'persevere'
  }
];

export default LEVELS;