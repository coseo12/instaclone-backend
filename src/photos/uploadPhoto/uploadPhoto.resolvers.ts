import { Resolver } from '../../types';
import { protectedResolver } from '../../users/users.utils';

const uploadPhotoFn: Resolver = async (
  _,
  { file, caption },
  { loggedInUser, client }
) => {
  if (caption) {
    let hashtagObj = null;
    const hashtags = caption.match(/#[\w]+/g);
    hashtagObj = hashtags.map(hashtag => ({
      where: { hashtag },
      create: { hashtag },
    }));
    return client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObj.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObj,
          },
        }),
      },
    });
    // parse caption
    // get or create Hashtags
  }
  // save the photo with parsed hashtags
  // ass the photo to the hashtags
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(uploadPhotoFn),
  },
};
