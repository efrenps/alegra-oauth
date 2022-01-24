/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import OauthServer from 'oauth2-server';
import lodash from 'lodash';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';

import {
  getAccessToken, saveToken, getClient, getUser, getUserFromClient, revokeAuthorizationCode, 
  getAuthorizationCode, saveAuthorizationCode, revokeToken, getRefreshToken,
} from '../helpers/OAuthHelper.js';

dotenv.config();
const { merge } = lodash;
const { JWT_SECRET } = process.env;

const { Request, Response } = OauthServer;
const oauthServer = new OauthServer({
    model: {
      getAccessToken,
      saveToken,
      getAuthorizationCode,
      getClient,
      getUser,
      getUserFromClient,
      revokeAuthorizationCode,
      revokeToken,
      getRefreshToken,
      saveAuthorizationCode,
      generateAccessToken(_client, user) {
        return jwt.sign(merge({}, user, { ref: md5(uuidv4()) }), JWT_SECRET);
      },
    },
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 1.577e+8, // 5 years
  });

const oauthToken = (req, res, next) => {
    const request = new Request(req);
    const response = new Response(res);
  
    oauthServer.token(request, response)
      .then((token) => {
        const { user } = token;

        const data = {
          ...response.body,
          user: {
            userId: user._id,
            userName: user.username,
            scope: user.scope,
          }
        };

        res.set(response.headers);
        res.json(data);
      }).catch(err => next(err));
  };
  
const oauthAuthorize = (req, res, next) => {
    const request = new Request(req);
    const response = new Response(res);
  
    oauthServer.authorize(request, response).then(() => {
      res.status(response.status).set(response.headers).end();
    }).catch(err => next(err));
  };
  
// TODO: Validate multiples scopes
const oauthAuthenticate = (req, res, next) => {
    const request = new Request(req);
    const response = new Response(res);
  
    oauthServer.authenticate(request, response)
      .then((token) => {
        const { accessToken, accessTokenExpiresAt, user } = token;

        const data = {
          accessToken,
          accessTokenExpiresAt,
          userId: user._id,
          userName: user.username,
          scope: user.scope,
          allowed: true,
        }
        // Request is authorized.
        res.status(200).end(JSON.stringify(data));
      })
      .catch(err => next(err));
  };

  export {
    oauthToken, oauthAuthorize, oauthAuthenticate,
  };
