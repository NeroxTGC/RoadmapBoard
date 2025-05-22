import { HttpError } from 'wasp/server'
import { isValidFeatureState } from './config/featureStates';

export const createFeedback = async ({ title, description }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const newFeedback = await context.entities.Feedback.create({
    data: {
      title,
      description,
      status: "open",
      author: { connect: { id: context.user.id } },
      createdAt: new Date()
    }
  });

  return newFeedback;
}

export const commentOnFeedback = async ({ feedbackId, content }, context) => {
  if (!context.user) { throw new HttpError(401) };
  const feedback = await context.entities.Feedback.findUnique({
    where: { id: feedbackId }
  });
  if (!feedback) { throw new HttpError(404, 'Feedback not found') };
  const comment = await context.entities.Comment.create({
    data: {
      content,
      author: { connect: { id: context.user.id } },
      feedback: { connect: { id: feedbackId } },
      createdAt: new Date()
    }
  });
  return comment;
}

export const upvoteFeedback = async ({ feedbackId }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const existingUpvote = await context.entities.Upvote.findFirst({
    where: {
      feedbackId: feedbackId,
      userId: context.user.id
    }
  });

  if (existingUpvote) {
    await context.entities.Upvote.delete({
      where: { id: existingUpvote.id }
    });
    return { feedbackId, isUpvoted: false };
  } else {
    await context.entities.Upvote.create({
      data: {
        feedbackId: feedbackId,
        userId: context.user.id
      }
    });
    return { feedbackId, isUpvoted: true };
  }
}

export const updateFeedbackStatus = async ({ feedbackId, newStatus }, context) => {
  if (!context.user) { throw new HttpError(401) }
  if (!context.user.isAdmin) { throw new HttpError(403) }

  const feedback = await context.entities.Feedback.findUnique({
    where: { id: feedbackId }
  });
  if (!feedback) { throw new HttpError(404, 'Feedback not found') }

  return context.entities.Feedback.update({
    where: { id: feedbackId },
    data: { status: newStatus }
  });
}

export const createFeature = async ({ title, description }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to create a feature') };

  try {
    const newFeature = await context.entities.Feature.create({
      data: {
        title,
        description,
        status: "PROPOSED",
        user: { 
          connect: { id: context.user.id } 
        }
      }
    });

    return newFeature;
  } catch (error) {
    console.error('Error creating feature:', error);
    throw new HttpError(500, 'Failed to create feature');
  }
};

export const commentOnFeature = async ({ featureId, content }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to comment') };

  if (!featureId || isNaN(parseInt(featureId))) {
    throw new HttpError(400, 'Invalid feature ID');
  }

  const feature = await context.entities.Feature.findUnique({
    where: { id: parseInt(featureId) }
  });
  if (!feature) { throw new HttpError(404, 'Feature not found') };

  const comment = await context.entities.Comment.create({
    data: {
      content,
      author: { connect: { id: context.user.id } },
      feature: { connect: { id: parseInt(featureId) } }
    }
  });

  return comment;
}

export const deleteComment = async ({ commentId }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to delete a comment') };

  const comment = await context.entities.Comment.findUnique({
    where: { id: parseInt(commentId) },
    include: { author: true }
  });

  if (!comment) { throw new HttpError(404, 'Comment not found') };

  // Check if user is admin or comment author
  if (!context.user.isAdmin && comment.authorId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to delete this comment');
  }

  await context.entities.Comment.delete({
    where: { id: parseInt(commentId) }
  });

  return { success: true, message: 'Comment deleted successfully' };
}

export const reactToComment = async ({ commentId, type }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to react to comments') };

  const comment = await context.entities.Comment.findUnique({
    where: { id: parseInt(commentId) }
  });

  if (!comment) { throw new HttpError(404, 'Comment not found') };

  // Toggle reaction
  const existingReaction = await context.entities.CommentReaction.findFirst({
    where: {
      commentId: parseInt(commentId),
      userId: context.user.id,
      type
    }
  });

  if (existingReaction) {
    await context.entities.CommentReaction.delete({
      where: { id: existingReaction.id }
    });
    return { commentId, type, action: 'removed' };
  } else {
    await context.entities.CommentReaction.create({
      data: {
        type,
        comment: { connect: { id: parseInt(commentId) } },
        user: { connect: { id: context.user.id } }
      }
    });
    return { commentId, type, action: 'added' };
  }
}

export const upvoteFeature = async ({ featureId }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to upvote') };

  if (!featureId || isNaN(parseInt(featureId))) {
    throw new HttpError(400, 'Invalid feature ID');
  }

  const parsedFeatureId = parseInt(featureId);

  const existingUpvote = await context.entities.Upvote.findFirst({
    where: {
      featureId: parsedFeatureId,
      userId: context.user.id
    }
  });

  if (existingUpvote) {
    await context.entities.Upvote.delete({
      where: { id: existingUpvote.id }
    });
    return { featureId: parsedFeatureId, isUpvoted: false };
  } else {
    await context.entities.Upvote.create({
      data: {
        feature: { connect: { id: parsedFeatureId } },
        user: { connect: { id: context.user.id } }
      }
    });
    return { featureId: parsedFeatureId, isUpvoted: true };
  }
}

export const updateFeatureStatus = async ({ featureId, newStatus }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to update status') }
  if (!context.user.isAdmin) { throw new HttpError(403, 'Only admins can update status') }

  if (!featureId || isNaN(parseInt(featureId))) {
    throw new HttpError(400, 'Invalid feature ID');
  }

  const parsedFeatureId = parseInt(featureId);

  const feature = await context.entities.Feature.findUnique({
    where: { id: parsedFeatureId }
  });
  
  if (!feature) { throw new HttpError(404, 'Feature not found') }

  if (!isValidFeatureState(newStatus)) {
    throw new HttpError(400, 'Invalid status')
  }

  return context.entities.Feature.update({
    where: { id: parsedFeatureId },
    data: { 
      status: newStatus,
      updatedAt: new Date()
    }
  });
}

export const updateFeature = async ({ featureId, data }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to update a feature') };

  const feature = await context.entities.Feature.findUnique({
    where: { id: parseInt(featureId) }
  });

  if (!feature) { throw new HttpError(404, 'Feature not found') };
  if (!context.user.isAdmin && feature.userId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to update this feature');
  }

  const updateData = {
    ...(data.title && { title: data.title }),
    ...(data.description && { description: data.description }),
    updatedAt: new Date()
  };

  return context.entities.Feature.update({
    where: { id: parseInt(featureId) },
    data: updateData
  });
}

export const deleteFeature = async ({ featureId }, context) => {
  if (!context.user) { throw new HttpError(401, 'You must be logged in to delete a feature') };
  if (!context.user.isAdmin) { throw new HttpError(403, 'Only admins can delete features') };

  if (!featureId || isNaN(parseInt(featureId))) {
    throw new HttpError(400, 'Invalid feature ID');
  }

  const parsedFeatureId = parseInt(featureId);

  const feature = await context.entities.Feature.findUnique({
    where: { id: parsedFeatureId }
  });

  if (!feature) {
    throw new HttpError(404, 'Feature not found');
  }

  await context.entities.Feature.delete({
    where: { id: parsedFeatureId }
  });

  return { success: true, message: 'Feature deleted successfully' };
};
