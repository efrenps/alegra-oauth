/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import _ from 'lodash';
import bcrypt from 'bcrypt';
import {
  AccessToken, Client, RefreshToken, AuthorizationCode, User,
} from '../models/index.js';

const getAccessToken = function getAccessToken(accessToken) {
  return AccessToken
  .findOne({ accessToken })
  .populate('user')
  .populate('client')
  .lean()
  .then(dbToken => dbToken)
  .catch((err) => {
    console.log('getAccessToken - Err: ', err);
  });
};

const saveToken = function saveToken(token, client, user) {
  return Promise.all([
      AccessToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: client._id,
        user: user._id,
        scope: token.scope
      }),
      token.refreshToken ? RefreshToken.create({
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: client._id,
        user: user._id,
        scope: token.scope
      }) : Promise.resolve()
    ])
      .then(() => _.assign({ client, user }, token))
      .catch((err) => {
        console.log('revokeToken - Err: ', err);
      });
};

const getClient = function getClient(clientId, clientSecret) {
  const query = { clientId };
  if (clientSecret) {
    query.clientSecret = clientSecret;
  }

  return Client
  .findOne(query)
  .lean()
  .then(client => (client ? Object.assign(client, { id: clientId }) : null))
  .catch((err) => {
    console.log('getClient - Err: ', err);
  });
}

const revokeAuthorizationCode = function revokeAuthorizationCode(code) {
  return AuthorizationCode.findOneAndRemove({ code: code.code })
    .then(removed => !!removed)
    .catch((err) => {
      console.log('revokeAuthorizationCode - Err: ', err);
    });
}

const getAuthorizationCode = function getAuthorizationCode(code) {
  return AuthorizationCode
    .findOne({ code })
    .populate('user')
    .populate('client')
    .lean()
    .then((authCodeModel) => {
      if (!authCodeModel) {
        return false;
      }

      const extendedClient = Object.assign(authCodeModel.client, { id: authCodeModel.client.clientId });
      return Object.assign(authCodeModel, { client: extendedClient });
    })
    .catch((err) => {
      console.log('getAuthorizationCode - Err: ', err);
    });
}

const saveAuthorizationCode = function saveAuthorizationCode(code, client, user) {
  return AuthorizationCode
    .create({
      expiresAt: code.expiresAt,
      client: client._id,
      code: code.authorizationCode,
      user: user._id,
      scope: code.scope
    })
    .then(() => ({
      authorizationCode: code.authorizationCode,
      authorization_code: code.authorizationCode,
      expires_in: Math.floor((code.expiresAt - new Date()) / 1000)
    }))
    .catch((err) => {
      console.log('saveAuthorizationCode - Err: ', err);
    });
}

const revokeToken = function revokeToken(token) {
  return RefreshToken.findOneAndRemove({ refreshToken: token.refreshToken })
    .then(removed => !!removed)
    .catch((err) => {
      console.log('revokeToken - Err: ', err);
    });
}

const getRefreshToken = function getRefreshToken(refreshToken) {
  return RefreshToken
    .findOne({ refreshToken })
    .populate('user')
    .populate('client')
    .lean()
    .then((dbToken) => {
      if (!dbToken) {
        return false;
      }

      const extendedClient = Object.assign(dbToken.client, { id: dbToken.client.clientId });
      return Object.assign(dbToken, { client: extendedClient });
    })
    .catch((err) => {
      console.log('getRefreshToken - Err: ', err);
    });
}


const getUser = function getUser(username, password) {
  return User.findOne({ username })
    .lean()
    .then((dbUser) => {
      if (bcrypt.compareSync(password, dbUser.password)) {
        return dbUser;
      }
      return false;
    })
    .catch((err) => {
      console.log('getUser - Err: ', err);
    });
}

const getUserFromClient = function getUserFromClient(client) {
  return User.findById(client.user)
    .lean()
    .then(dbUser => dbUser)
    .catch((err) => {
      console.log('getUserFromClient - Err: ', err);
    });
}

const validateScope = function validateScope(user, client, scope) {
  return (user.scope === scope && client.scope === scope && scope !== null) ? scope: false;
}

const verifyScope = function verifyScope(token, scope) {
  return token.scope === scope;
}

export {
  getAccessToken, saveToken, getClient, getUser, getUserFromClient, revokeAuthorizationCode, 
  getAuthorizationCode, saveAuthorizationCode, revokeToken, getRefreshToken, validateScope, verifyScope,
};