import { confirmParticipant } from "@/firebase/match";

export const handleConfirmParticipation = async (
  matchId: string,
  participantId: string
): Promise<void> => {
  await confirmParticipant(matchId, participantId);
};
