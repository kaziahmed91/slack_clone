
/** Function that takes a resolver and returns another resolver.  
 *  First the previous resolver is resolved.(line 10) Once that is done the next resolver is returned. 
 * 
*/
const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
      const newResolver = async (parent, args, context, info) => {
        await resolver(parent, args, context, info);
        return childResolver(parent, args, context, info);
      };
      return createResolver(newResolver);
    };
    return baseResolver;
  };
  
  // checks the context of the user, making sure there is a user and a user ID exists. 
  // This wraps a component; guards resolvers!!!!!  
  export default createResolver( (parent, args, { user }) => {
    if (!user || !user.id) {
      throw new Error('Not authenticated');
    }
  });


