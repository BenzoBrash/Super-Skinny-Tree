// src/services/treeService.ts

/**
 * This service contains the business logic for calculating a user's tree growth
 * and determining their progress towards narrative milestones.
 */

export type UserActivity = {
  connections: number;
  cardsSent: number;
  referrals: number; // Number of users they successfully referred
  appSpendTotal: number; // Total amount spent in the app
  loginStreak: number; // Number of consecutive days logged in
};

export type Milestone = {
  height: number;
  title: string;
  description: string;
};

export type TreeMilestoneInfo = {
  currentHeight: number;
  progressPercentage: number;
  nextMilestone: Milestone | null;
  lastMilestone: Milestone | null;
  unlockedMilestones: Milestone[];
};

// Define the growth factors
const FEET_PER_CONNECTION = 1;
const FEET_PER_CARD_SENT = 0.5;
const FEET_PER_LOGIN_STREAK_DAY = 0.1; // A small boost for engagement
const FEET_PER_REFERRAL_BASE = 100; // A huge bonus for bringing in a friend!

const SPEND_GROWTH_FACTOR = 1; // 1 foot per dollar on average
const GROWTH_RANDOMIZATION_RANGE = 0.2; // +/- 20%

// Define the narrative milestones
const NARRATIVE_MILESTONES: Milestone[] = [
  { 
    height: 30, 
    title: "A Bird Family Moved In!", 
    description: "Your tree is now a home. A donation has been made to the Humane Society in your honor.",
  },
  { 
    height: 85, 
    title: "Your Tree Dropped a Seed!", 
    description: "Look closely! Your tree dropped a seed that's already sprouting. This represents new life and new beginnings.",
  },
  { 
    height: 150,
    title: "A River Flows & Squirrels Appear",
    description: "Your tree is creating its own ecosystem! You've attracted squirrels, and a river now flows nearby. A donation has been made to protect natural waterways.",
  },
  { 
    height: 250,
    title: "Campers Arrived!",
    description: "A family of campers has set up nearby, enjoying the shade and beauty of your tree.",
  },
  { 
    height: 500, 
    title: "A Mighty Oak", 
    description: "Your tree has become a landmark in the growing forest community!" 
  },
  { 
    height: 1000, 
    title: "Heart of the Forest", 
    description: "You've grown a true giant, supporting a vibrant ecosystem for all to enjoy." 
  },
];

/**
 * Calculates a randomized growth amount based on a base value.
 * @param baseValue The base number to randomize.
 * @returns A randomized number +/- the GROWTH_RANDOMIZATION_RANGE.
 */
function getRandomizedGrowth(baseValue: number): number {
    const randomFactor = (Math.random() - 0.5) * 2 * GROWTH_RANDOMIZATION_RANGE; // Creates a number between -0.2 and 0.2
    return baseValue * (1 + randomFactor);
}


/**
 * Calculates the current height of a user's tree based on their activity.
 * @param activity - An object containing the user's activity metrics.
 * @returns The total height of the tree in feet.
 */
export function calculateTreeHeight(activity: UserActivity): number {
  const heightFromConnections = activity.connections * FEET_PER_CONNECTION;
  const heightFromCards = activity.cardsSent * FEET_PER_CARD_SENT;
  const heightFromEngagement = activity.loginStreak * FEET_PER_LOGIN_STREAK_DAY;
  
  // Calculate randomized growth from spending
  const randomizedSpendGrowth = getRandomizedGrowth(activity.appSpendTotal * SPEND_GROWTH_FACTOR);
  
  // Calculate randomized growth from referrals
  const randomizedReferralGrowth = getRandomizedGrowth(activity.referrals * FEET_PER_REFERRAL_BASE);

  return heightFromConnections + heightFromCards + heightFromEngagement + randomizedSpendGrowth + randomizedReferralGrowth;
}

/**
 * Determines the user's progress towards their next donation milestone.
 * @param currentHeight - The current height of the user's tree.
 * @returns An object with the current height, the next milestone, and progress percentage.
 */
export function getTreeMilestoneInfo(currentHeight: number): TreeMilestoneInfo {
  const unlockedMilestones = NARRATIVE_MILESTONES.filter(m => currentHeight >= m.height);
  const lastMilestone = unlockedMilestones.length > 0 ? unlockedMilestones[unlockedMilestones.length - 1] : null;
  const nextMilestone = NARRATIVE_MILESTONES.find(m => currentHeight < m.height) || null;

  let progressPercentage = 0;
  if (nextMilestone) {
    const previousMilestoneHeight = lastMilestone ? lastMilestone.height : 0;
    const heightTowardsNextMilestone = currentHeight - previousMilestoneHeight;
    const totalHeightForNextMilestone = nextMilestone.height - previousMilestoneHeight;
    
    progressPercentage = (totalHeightForNextMilestone > 0)
      ? Math.min(Math.floor((heightTowardsNextMilestone / totalHeightForNextMilestone) * 100), 100)
      : 100;
  } else if (unlockedMilestones.length > 0) {
    // User has passed all milestones
    progressPercentage = 100;
  }

  return {
    currentHeight,
    progressPercentage,
    nextMilestone,
    lastMilestone,
    unlockedMilestones,
  };
}
