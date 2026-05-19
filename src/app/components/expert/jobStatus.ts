import type { ExpertJobListItemVM } from "../../../types/expert";

export type ExpertBidAvailability = "입찰 가능" | "입찰 마감";

export function getExpertBidAvailability(
  project: Pick<ExpertJobListItemVM, "status">,
): ExpertBidAvailability {
  return project.status === "입찰 마감" ? "입찰 마감" : "입찰 가능";
}

export function canBidOnExpertJob(
  project: Pick<ExpertJobListItemVM, "status">,
) {
  return getExpertBidAvailability(project) === "입찰 가능";
}
