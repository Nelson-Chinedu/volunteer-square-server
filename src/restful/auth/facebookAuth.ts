import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import generator from 'generate-password';
import winstonEnvLogger from 'winston-env-logger';

import sendToEmail from '../../lib/sendMail';

import { Account, Profile } from '../../db';

passport.use(new FacebookStrategy({
  clientID: process.env.CLIENT_ID_FB as string,
  clientSecret: process.env.CLIENT_SECRET_FB as string,
  callbackURL: `${process.env.BASE_URL}/auth/facebook/callback` as string,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
async (
  _accessToken: any,
  _refreshToken: any,
  { _json: { email, name } }: any,
  done: any
) => {
  try {
    const fullname = name.split(' ');
    const firstname = fullname[0];
    const lastname = fullname[1];
    let account = await Account.findOne({
      where: {
        email,
      },
    });
    if (account) {
      const profile = await Profile.findOne({
        where: {
          id: account.profile.id
        }
      });
      return done(null, {account, profile});
    }
    const password = generator.generate({
      length: 10,
      numbers: true
    });

    if(process.env.NODE_ENV === 'production'){
    const mailMessage = {
      name: `Welcome ${name}`,
      body: `Your generated password is ${password}`,
    };
    await sendToEmail(email, mailMessage);
  }

    const newProfile = Profile.create({
      firstname,
      lastname
    });
    await newProfile.save();
    account = Account.create({
      email,
      password,
      verified: true,
      profile: newProfile
    });
    account.save();
    return done(null, {account});
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error,
    });
  }
}
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});