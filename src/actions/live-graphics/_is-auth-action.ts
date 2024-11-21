import { ActionError, type ActionAPIContext } from 'astro:actions';
import { AUTH_BEARER_TOKEN, AUTH_SECRET_TOKEN } from 'astro:env/server';
import { authCoreGraphicsCookieName } from 'src/services/core-graphics/constants';

export function isAuth(context: ActionAPIContext) {
  const isAuthCookie =
    AUTH_SECRET_TOKEN &&
    context.cookies.has(authCoreGraphicsCookieName) &&
    context.cookies.get(authCoreGraphicsCookieName)?.value === AUTH_SECRET_TOKEN;
  const isBearerAuth =
    AUTH_BEARER_TOKEN &&
    context.request.headers.get('Authorization') === `Bearer ${AUTH_BEARER_TOKEN}`;
  const isAuth = isAuthCookie || isBearerAuth;
  if (!isAuth) {
    console.error('Unauthorized cookie or not present');
    throw new ActionError({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
  }
}
