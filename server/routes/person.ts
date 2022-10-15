import TheMovieDb from '@server/api/themoviedb';
import { MediaStatus } from '@server/constants/media';
import Media from '@server/entity/Media';
import { getSettings } from '@server/lib/settings';
import logger from '@server/logger';
import {
  mapCastCredits,
  mapCrewCredits,
  mapPersonDetails,
} from '@server/models/Person';
import { Router } from 'express';

const personRoutes = Router();

personRoutes.get('/:id', async (req, res, next) => {
  const tmdb = new TheMovieDb();

  try {
    const person = await tmdb.getPerson({
      personId: Number(req.params.id),
      language: req.locale ?? (req.query.language as string),
    });
    return res.status(200).json(mapPersonDetails(person));
  } catch (e) {
    logger.debug('Something went wrong retrieving person', {
      label: 'API',
      errorMessage: e.message,
      personId: req.params.id,
    });
    return next({
      status: 500,
      message: 'Unable to retrieve person.',
    });
  }
});

personRoutes.get('/:id/combined_credits', async (req, res, next) => {
  const tmdb = new TheMovieDb();
  const settings = getSettings();

  try {
    const combinedCredits = await tmdb.getPersonCombinedCredits({
      personId: Number(req.params.id),
      language: req.locale ?? (req.query.language as string),
    });

    let castMedia = await Media.getRelatedMedia(
      combinedCredits.cast.map((result) => result.id)
    );

    let crewMedia = await Media.getRelatedMedia(
      combinedCredits.crew.map((result) => result.id)
    );

    if (settings.main.hideAvailable) {
      castMedia = castMedia.filter(
        (media) =>
          (media.mediaType === 'movie' || media.mediaType === 'tv') &&
          media.status !== MediaStatus.AVAILABLE &&
          media.status !== MediaStatus.PARTIALLY_AVAILABLE
      );

      crewMedia = crewMedia.filter(
        (media) =>
          (media.mediaType === 'movie' || media.mediaType === 'tv') &&
          media.status !== MediaStatus.AVAILABLE &&
          media.status !== MediaStatus.PARTIALLY_AVAILABLE
      );
    }

    return res.status(200).json({
      cast: combinedCredits.cast
        .map((result) =>
          mapCastCredits(
            result,
            castMedia.find(
              (med) =>
                med.tmdbId === result.id && med.mediaType === result.media_type
            )
          )
        )
        .filter((item) => !item.adult),
      crew: combinedCredits.crew
        .map((result) =>
          mapCrewCredits(
            result,
            crewMedia.find(
              (med) =>
                med.tmdbId === result.id && med.mediaType === result.media_type
            )
          )
        )
        .filter((item) => !item.adult),
      id: combinedCredits.id,
    });
  } catch (e) {
    logger.debug('Something went wrong retrieving combined credits', {
      label: 'API',
      errorMessage: e.message,
      personId: req.params.id,
    });
    return next({
      status: 500,
      message: 'Unable to retrieve combined credits.',
    });
  }
});

export default personRoutes;
