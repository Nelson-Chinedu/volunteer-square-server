import passport from 'passport';
import {Strategy as GoogleStrategy } from 'passport-google-oauth20';
import generator from 'generate-password';
import winstonEnvLogger from 'winston-env-logger';

import sendToEmail from '../../lib/sendMail';

import { Account, Profile } from '../../db';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: `${process.env.BASE_URL}/google/callback` as string,
    },
    async (
      _accessToken: any,
      _refreshToken: any,
      { _json: { given_name, family_name, email, email_verified } }: any,
      done: any
    ) => {
      try {
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
          name: `Welcome ${given_name} ${family_name}`,
          body: `Your generated password is ${password}`,
        };
        await sendToEmail(email, mailMessage);
      }

        const newProfile = Profile.create({
          firstname: given_name,
          lastname: family_name
        });
        await newProfile.save();
        account = Account.create({
          email,
          password,
          verified: email_verified,
          profile: newProfile
        });
        account.save();
        return done(null, {account, newProfile});
      } catch (error) {
        winstonEnvLogger.error({
          message: 'An error occured',
          error,
        });
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
  done(null, id);
});
