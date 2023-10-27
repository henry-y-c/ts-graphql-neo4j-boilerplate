import { Business } from './generated/ogm-types';

export const resolvers = {
  Query: {
    hello: () => 'hello graphql',
  },

  Business: {
    avgStars: (obj: Business) => {
      const { reviews } = obj;
      if (reviews.length === 0) return 0;
      const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
      return totalStars / reviews.length;
    },
  },
};
