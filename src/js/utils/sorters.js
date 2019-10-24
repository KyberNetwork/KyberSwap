export function sortQuotePriority(tokens, first, second) {
  const firstQuotePriority = tokens[first].quote_priority;
  const secondQuotePriority = tokens[second].quote_priority;

  if (firstQuotePriority && secondQuotePriority) {
    if (firstQuotePriority > secondQuotePriority) return -1;
    else if (firstQuotePriority < secondQuotePriority) return 1;
  }

  return 0;
}
