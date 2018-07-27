import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign({
      user: _.pick(user, ['id', 'username']),
    },
    secret, {
      expiresIn: '1h', //shorten the time to give the access
    },
  );

  const createRefreshToken = jwt.sign({
      user: _.pick(user, 'id'),
    },
    secret2, {
      expiresIn: '7d',
    },
  );

  return [createToken, createRefreshToken];
};

/** We first decode the refresh token, set it to id  */
export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  
  let userId = 0;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }
  
  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;
  
  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }
  
  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET, SECRET2) => { // this function is used in the resolvers 
  const user = await models.User.findOne({
    where: {
      email
    },
    raw: true
  });
  // console.log(user);
  if (!user) {
    // user with provided email not found
    return {
      ok: false,
      errors: [{
        path: 'email',
        message: 'No user with this email exists'
      }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  // console.log(valid)
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{
        path: 'password',
        message: 'Incorrect password'
      }],
    };
  }

  const refreshTokenSecret = user.password + SECRET2; // allows token to expire if automaticaly passsword is changed  

  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};