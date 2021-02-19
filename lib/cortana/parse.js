'use strict';

module.exports = function cortanaParse(session, request) {
  if (session) {
    const entities = session.message.entities || [];
    const authToken = entities.find((entity) => {
      return entity.type === 'AuthorizationToken';
    }) || {};
    return {
      sender: session.message.user.id,
      text: session.message.text || '',
      originalRequest: request,
      type: 'cortana-skill',
      accessToken: authToken.token
    };
  }
};
