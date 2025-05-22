import { HttpError } from 'wasp/server'

export const getAllFeatures = async (args, context) => {
  const features = await context.entities.Feature.findMany({
    include: {
      user: true,
      comments: {
        include: {
          author: true,
          reactions: {
            include: {
              user: true
            }
          }
        }
      },
      upvotes: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return features.map(feature => ({
    id: feature.id,
    title: feature.title,
    description: feature.description,
    status: feature.status,
    priority: feature.priority,
    createdAt: feature.createdAt,
    updatedAt: feature.updatedAt,
    user: feature.user,
    commentCount: feature.comments.length,
    upvoteCount: feature.upvotes.length,
    isUpvotedByUser: context.user ? feature.upvotes.some(upvote => upvote.userId === context.user.id) : false,
    comments: feature.comments.map(comment => ({
      ...comment,
      reactionCounts: comment.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {}),
      userReactions: context.user ? comment.reactions
        .filter(r => r.userId === context.user.id)
        .map(r => r.type) : []
    }))
  }));
}

export const getFeatureById = async ({ id }, context) => {
  if (!id || isNaN(parseInt(id))) {
    throw new HttpError(400, 'Invalid feature ID');
  }

  const feature = await context.entities.Feature.findUnique({
    where: { 
      id: parseInt(id)
    },
    include: {
      comments: {
        include: {
          author: true,
          reactions: {
            include: {
              user: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      upvotes: true,
      user: true
    }
  });
  
  if (!feature) throw new HttpError(404, 'No feature with id ' + id);
  
  return {
    ...feature,
    isUpvotedByUser: context.user ? feature.upvotes.some(upvote => upvote.userId === context.user.id) : false,
    comments: feature.comments.map(comment => ({
      ...comment,
      reactionCounts: comment.reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {}),
      userReactions: context.user ? comment.reactions
        .filter(r => r.userId === context.user.id)
        .map(r => r.type) : []
    }))
  };
}

export const getUserUpvotes = async ({ userId }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to view your upvotes') }

  return context.entities.Upvote.findMany({
    where: {
      userId: userId
    },
    include: {
      feature: true
    }
  });
}
