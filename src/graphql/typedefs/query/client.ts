import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import profileType from '../generics/profile';
import eventsType from '../generics/eventCategory';
import volunteerType from '../generics/eventVolunteers';

import getProfileResolver from '../../resolvers/client/mutation/getProfile';
import getEventsResolver from '../../resolvers/client/query/getEvents';
import getEventVolunteerResolver from '../../resolvers/client/query/getEventVolunteer';

export default new GraphQLObjectType({
  name: 'ClientQuery',
  description: 'Query accessible to client',
  fields: () => ({
    getUserProfile: {
      description: 'Get user profile details',
      type: profileType,
      resolve: getProfileResolver,
    },
    getUserEvents: {
      description: 'Get user events',
      type: eventsType,
      args: {
        take: {type: new GraphQLNonNull(GraphQLInt)},
        skip: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: getEventsResolver
    },
    getEventVolunteers: {
      description: 'Get event volunteer',
      type: volunteerType,
      args: {
        eventId: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: getEventVolunteerResolver
    }
  }),
});
