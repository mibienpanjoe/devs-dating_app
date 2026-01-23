import { IUserProfile } from '../types';

function jaccardSimilarity(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size || 0;
}

function calculateCompatibility(
  userProfile1: IUserProfile,
  userProfile2: IUserProfile,
  preferences1?: any,
  preferences2?: any
): number {
  let score = 0;
  let totalWeight = 0;

  // Skills compatibility (weight: 40%)
  const skillsScore = jaccardSimilarity(userProfile1.skills || [], userProfile2.skills || []);
  score += skillsScore * 0.4;
  totalWeight += 0.4;

  // Languages compatibility (weight: 30%)
  const languagesScore = jaccardSimilarity(userProfile1.languages || [], userProfile2.languages || []);
  score += languagesScore * 0.3;
  totalWeight += 0.3;

  // Age compatibility (weight: 15%) - based on preferences
  let ageScore = 0;
  if (userProfile2.age && preferences1) {
    const age = userProfile2.age;
    if (preferences1.minAge && age < preferences1.minAge) ageScore = 0;
    else if (preferences1.maxAge && age > preferences1.maxAge) ageScore = 0;
    else ageScore = 1; // Within range
  } else {
    ageScore = 0.5; // Neutral if no age or preferences
  }
  score += ageScore * 0.15;
  totalWeight += 0.15;

  // Distance compatibility (weight: 15%) - if coordinates available
  let distanceScore = 0;
  if (userProfile1.coordinates && userProfile2.coordinates) {
    const distance = require('./geocode').calculateDistance(userProfile1.coordinates, userProfile2.coordinates);
    const maxDist = preferences1?.maxDistance || 50;
    if (distance <= maxDist) {
      distanceScore = 1 - (distance / maxDist); // Closer is better
    }
  } else {
    distanceScore = 0.5; // Neutral if no coordinates
  }
  score += distanceScore * 0.15;
  totalWeight += 0.15;

  // Normalize score
  return totalWeight > 0 ? score / totalWeight : 0;
}

export { calculateCompatibility };