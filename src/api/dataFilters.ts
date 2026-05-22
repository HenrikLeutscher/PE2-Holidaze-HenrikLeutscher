export const getLatestVenues = (venues: any[], count: number = 5) => {
  return venues
    .sort(
      (a: any, b: any) =>
        new Date(b.created).getTime() - new Date(a.created).getTime(),
    )
    .slice(0, count);
};

export const getTopVenues = (venues: any[], count: number = 5) => {
  return venues.filter((venue: any) => venue.rating >= 4.5).slice(0, count);
};
