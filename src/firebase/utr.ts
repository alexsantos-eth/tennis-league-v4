import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type {
  MatchRecord,
  MatchScorePayload,
  PublicMatchFormat,
} from "../types/match";
import type { User } from "../types/users";

/**
 * UTR Algorithm Implementation
 * 
 * The UTR Rating system is a weighted average of match ratings from the most recent 30 matches
 * (only counting matches within the last 12 months).
 * 
 * Formula: UTR = Σ(matchRating × matchWeight) / Σ(matchWeights)
 */

/**
 * Calculates the expected win percentage using sigmoid function (logistic curve)
 * This represents what % of games a player should win based on UTR difference
 * 
 * @param playerUTR - Current UTR of the player
 * @param opponentUTR - Current UTR of the opponent
 * @returns Expected win percentage (0-1) representing games won
 * 
 * Example:
 * - Same rating (6.0 vs 6.0) → 0.5 (50%)
 * - Higher rating (6.0 vs 5.0) → ~0.65 (65%)
 * - Much higher (6.0 vs 4.0) → ~0.95 (95%)
 */
function calculateExpectedWinPercentage(
  playerUTR: number,
  opponentUTR: number,
): number {
  const ratingDifference = playerUTR - opponentUTR;
  
  // Sigmoid function: 1 / (1 + e^(-x))
  // Scaled by 0.4 to make the curve less steep
  // (1 UTR point difference ≈ 5-7% advantage)
  const exponent = -(ratingDifference / 0.4);
  
  return 1 / (1 + Math.exp(exponent));
}

/**
 * Calculates the actual win percentage from match score
 * 
 * @param playerTeam - Player's team ("A" or "B")
 * @param score - Final match score
 * @returns Actual win percentage (games won / total games)
 */
function calculateActualWinPercentage(
  playerTeam: "A" | "B",
  score: MatchScorePayload,
): number {
  let playerGames = 0;
  let opponentGames = 0;

  score.sets.forEach((set) => {
    if (playerTeam === "A") {
      playerGames += set.teamA;
      opponentGames += set.teamB;
    } else {
      playerGames += set.teamB;
      opponentGames += set.teamA;
    }
  });

  const totalGames = playerGames + opponentGames;
  
  if (totalGames === 0) return 0.5; // Default to 50% if no games recorded
  
  return playerGames / totalGames;
}

/**
 * Calculates the match rating (how much the rating changes from this single match)
 * 
 * Key principle: Player gets bumped up if they perform BETTER than expected,
 * and down if they perform WORSE than expected. The adjustment is zero-sum
 * (if one player gains +0.15, the other loses -0.15).
 * 
 * @param playerUTR - Current UTR of the player
 * @param opponentUTR - Current UTR of the opponent
 * @param playerWins - Did the player win the match? (true/false)
 * @param actualWinPercentage - Percentage of games won by player
 * @returns Match rating adjustment (can be positive or negative)
 * 
 * Examples:
 * - Win against lower rated opponent as expected → small gain (~+0.05)
 * - Win against higher rated opponent unexpectedly → large gain (~+0.40)
 * - Lose to lower rated opponent unexpectedly → large loss (~-0.40)
 */
function calculateMatchRating(
  playerUTR: number,
  opponentUTR: number,
  actualWinPercentage: number,
): number {
  const expectedWinPercentage = calculateExpectedWinPercentage(
    playerUTR,
    opponentUTR,
  );

  // Performance vs expectation
  const performanceDifference = actualWinPercentage - expectedWinPercentage;

  // Scale the difference to rating points
  // A performance difference of ±100% maps to ±50 points
  // So max realistic movement is around ±0.50 per match
  const matchRating = performanceDifference * 0.5;

  return matchRating;
}

/**
 * Calculates match weight (importance of the match in final rating)
 * 
 * Four factors influence weight:
 * 1. Format: Best of 3 sets weighs more than 8-game pro set
 * 2. Competitiveness: Playing someone close to your rating weighs more
 * 3. Opponent Reliability: More reliable opponents (more matches) weigh more
 * 4. Time Decay: Recent matches weigh more than old ones
 * 
 * @param format - Match format (e.g., "Ranking" or "Friendly")
 * @param ratingDifference - Absolute difference between player and opponent UTR
 * @param opponentMatchCount - Number of matches opponent has in their rating history
 * @param daysSinceMatch - Days since the match was played
 * @returns Weight multiplier (0.3 to 1.0)
 */
function calculateMatchWeight(
  format: PublicMatchFormat,
  ratingDifference: number,
  opponentMatchCount: number,
  daysSinceMatch: number,
): number {
  // 1. Format weight: Ranking matches (longer) count more than Friendly
  const formatWeight = format === "Ranking" ? 1.0 : 0.7;

  // 2. Competitiveness: Penalize very lopsided matches
  // Difference of 0.5 pts = 1.0 weight, difference of 3+ pts = 0.6 weight
  const competitivenessWeight = Math.max(
    0.6,
    1.0 - Math.abs(ratingDifference) * 0.1,
  );

  // 3. Opponent reliability: More matches played = more reliable rating
  // < 5 matches = 0.7, 5-20 matches = 0.85, 20+ matches = 1.0
  let reliabilityWeight = 0.7;
  if (opponentMatchCount >= 5) reliabilityWeight = 0.85;
  if (opponentMatchCount >= 20) reliabilityWeight = 1.0;

  // 4. Time decay: Recent matches weight more
  // 0-30 days = 1.0, 180 days = 0.7, 365 days = 0.3
  const timeFactor = Math.max(0.3, 1.0 - daysSinceMatch / 1000);

  // Combine all factors (multiplicative)
  const weight =
    formatWeight * competitivenessWeight * reliabilityWeight * timeFactor;

  return Math.max(0.3, Math.min(1.0, weight)); // Clamp between 0.3 and 1.0
}

/**
 * Calculates the new UTR rating based on match history
 * 
 * Takes the weighted average of:
 * - Up to 30 most recent matches
 * - Only matches within the last 12 months
 * 
 * @param matchHistory - Array of past matches with their ratings and weights
 * @returns New UTR rating
 */
function calculateNewUTRRating(
  matchHistory: Array<{ rating: number; weight: number }>,
): number {
  if (matchHistory.length === 0) return 0;

  const sumWeightedRatings = matchHistory.reduce(
    (sum, match) => sum + match.rating * match.weight,
    0,
  );
  const sumWeights = matchHistory.reduce(
    (sum, match) => sum + match.weight,
    0,
  );

  return sumWeightedRatings / sumWeights;
}

/**
 * Main function to process UTR rating updates when a match is finalized
 * 
 * This is called when a RANKING format match is finished.
 * For FRIENDLY matches, we don't update ratings (optional enhancement).
 * 
 * @param match - The completed match record
 * @param playerAIds - Array of player IDs on Team A
 * @param playerBIds - Array of player IDs on Team B
 */
export async function updatePlayersUTRAfterMatch(
  match: MatchRecord,
  playerAIds: string[],
  playerBIds: string[],
): Promise<void> {
  // Only update ratings for Ranking format matches
  if (match.matchFormat !== "Ranking" || !match.scoreBoard?.finalScore) {
    return;
  }

  const finalScore = match.scoreBoard.finalScore;
  const matchDate = new Date(match.scheduledAt || match.createdAt);
  const today = new Date();
  const daysSinceMatch = Math.floor(
    (today.getTime() - matchDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Don't process matches older than 12 months
  if (daysSinceMatch > 365) {
    return;
  }

  // Determine winning team
  let teamAGames = 0;
  let teamBGames = 0;

  finalScore.sets.forEach((set) => {
    teamAGames += set.teamA;
    teamBGames += set.teamB;
  });

  const teamAWins = teamAGames > teamBGames;

  // Process Team A players
  const teamAPlayers = playerAIds.length > 0 ? playerAIds : [match.createdBy.uid || ""];
  const teamBPlayers = playerBIds.length > 0 ? playerBIds : [];

  // Calculate average UTR for each team
  const teamAUsers = await Promise.all(
    teamAPlayers.map((id) => getUser(id)),
  );
  const teamBUsers = await Promise.all(
    teamBPlayers.map((id) => getUser(id)),
  );

  const avgTeamAUTR =
    teamAUsers.filter(Boolean).reduce((sum, u) => sum + (u?.utr || 0), 0) /
    Math.max(1, teamAUsers.filter(Boolean).length);
  const avgTeamBUTR =
    teamBUsers.filter(Boolean).reduce((sum, u) => sum + (u?.utr || 0), 0) /
    Math.max(1, teamBUsers.filter(Boolean).length);

  // Update Team A players
  for (const userId of teamAPlayers) {
    if (!userId) continue;

    const user = await getUser(userId);
    if (!user) continue;

    const playerActualWinPct = teamAWins ? 0.66 : 0.34; // Simplified for team matches (2/3 vs 1/3)
    const matchRating = calculateMatchRating(
      user.utr,
      avgTeamBUTR,
      playerActualWinPct,
    );

    const weight = calculateMatchWeight(
      match.matchFormat,
      Math.abs(user.utr - avgTeamBUTR),
      teamBUsers.filter(Boolean).length,
      daysSinceMatch,
    );

    // Update user's UTR by adding the weighted match rating
    const newUTR = (user.utr || 0) + matchRating * weight;

    await updateUserUTR(userId, newUTR);
  }

  // Update Team B players (inverse logic)
  for (const userId of teamBPlayers) {
    if (!userId) continue;

    const user = await getUser(userId);
    if (!user) continue;

    const playerActualWinPct = teamAWins ? 0.34 : 0.66;
    const matchRating = calculateMatchRating(
      user.utr,
      avgTeamAUTR,
      playerActualWinPct,
    );

    const weight = calculateMatchWeight(
      match.matchFormat,
      Math.abs(user.utr - avgTeamAUTR),
      teamAUsers.filter(Boolean).length,
      daysSinceMatch,
    );

    const newUTR = (user.utr || 0) + matchRating * weight;

    await updateUserUTR(userId, newUTR);
  }
}

/**
 * Helper: Gets a user from Firestore
 */
async function getUser(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      uid: userDoc.id,
      name: userData.name || "",
      picture: userData.picture || "",
      utr: Number(userData.utr) || 0,
      phone: userData.phone || "",
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      category: userData.category,
    } as User;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Helper: Updates a user's UTR in Firestore
 */
async function updateUserUTR(
  userId: string,
  newUTR: number,
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      utr: Math.round(newUTR * 100) / 100, // Round to 2 decimals
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user UTR:", error);
  }
}

// Export individual functions for testing
export {
  calculateExpectedWinPercentage,
  calculateActualWinPercentage,
  calculateMatchRating,
  calculateMatchWeight,
  calculateNewUTRRating,
};
