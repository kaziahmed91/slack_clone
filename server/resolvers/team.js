import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';

export default {
  // Below the entire resolver is wrapped with createResolver -> which is chekcing if the user is created or not
  Query: {
    allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })),
  },
  Mutation: {
    //  First thing requiresAuth is being checked (its the export default on permissions )
    //  Then createResolver is being run if authenticated. 
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {

        // Transaction makes sure multiple db transactions successfully go through. 
        // If one of them does not, then the entire transaction is void.
        // we are creating a general channel automatically once a team is created
        const response = await models.sequelize.transaction(
          async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({ name: 'general', public: true, teamId: team.id });
            return team; 
          }
        )

        return {
          ok: true,
          team: response,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),


    addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
      try {

        //  We have two db queries as promises. we chain them and do a promise.all resolve. 

        const teamPromise = models.Team.findOne({where: { id: teamId}}, {raw: true}); 
        const userToAddPromise = models.User.findOne({where: {email}}, {raw: true}); 

        const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
        console.log(team, user)
        if ( team.owner !== user.id ) { 
          return { 
            ok: false, 
            errors: [{path: email, message: "You cannot add members to the team"}] 
          } 
        }
        if (!userToAdd) {
          return {
            ok: false, 
            errors: [{path: email, message: "Can't find user with this email. "}] 
          } 
        }
        await models.Member.create({ userId: userToAdd.id, teamId });
        return {
          ok: true,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};