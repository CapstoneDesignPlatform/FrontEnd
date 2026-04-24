export const getAverageBidAmount = (bidList) => {
  if (!bidList.length) return 0
  return bidList.reduce((sum, bid) => sum + Number(bid.amount), 0) / bidList.length
}

export const getRecommendedBids = (bidList, thresholdRatio) => {
  if (!bidList.length) return []

  const average = getAverageBidAmount(bidList)
  const minimumAllowed = average * thresholdRatio

  return bidList
    .filter((bid) => Number(bid.amount) >= minimumAllowed)
    .sort((a, b) => Number(a.amount) - Number(b.amount))
    .slice(0, 5)
}

export const isDumpingBid = (bidAmount, average, thresholdRatio) => {
  if (!average) return false
  return Number(bidAmount) < average * thresholdRatio
}
