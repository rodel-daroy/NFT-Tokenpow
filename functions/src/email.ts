import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
// tslint:disable-next-line:no-implicit-dependencies
import {MailDataRequired} from '@sendgrid/helpers/classes/mail';
import {CallableContext} from 'firebase-functions/lib/providers/https';

const API_KEY = functions.config().sendgrid.key;
const REJECT_TEMPLATE = functions.config().sendgrid.reject_template;
const APPROVE_TEMPLATE = functions.config().sendgrid.approve_template;
const REACHED_TEMPLATE = functions.config().sendgrid.selltoken_reached_target_template;
// const DONATION_APPROVE_TEMPLATE = functions.config().sendgrid.donation_need_to_approve_template;

sgMail.setApiKey(API_KEY);

export const sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth && !context.auth.token.email) {
    throw new functions.https.HttpsError('failed-precondition', 'Must be logged in!');
  }

  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    templateId: REJECT_TEMPLATE,
    dynamicTemplateData: {
      message: data.message
    }
  } as MailDataRequired;

  await sgMail.send(msg);

  return {success: true};
});

export const sendselltokenTargetReachedEmail = functions.https.onCall(async (data, context) => {
  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    templateId: REACHED_TEMPLATE,
    dynamicTemplateData: {
      selltokenUrl: data.selltokenUrl
    }
  } as MailDataRequired;

  await sgMail.send(msg);

  return {success: true};
});

export const sendApproveEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth && !context.auth.token.email) {
    throw new functions.https.HttpsError('failed-precondition', 'Must be logged in!');
  }

  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    templateId: APPROVE_TEMPLATE,
    dynamicTemplateData: {
      userFirstName: data.userFirstName,
      selltokenTitle: data.selltokenTitle,
      selltokenUrl: data.selltokenUrl
    }
  } as MailDataRequired

  await sgMail.send(msg);

  return {success: true};
});

export const sendDonationApproveEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: 'gobitfundme@protonmail.com',
    from: 'noreply@tokenpow.com',
    subject: 'New donation',
    text: 'There is new pending donation for selltokens.'
  } as MailDataRequired

  await sgMail.send(msg);

  return { success: true };
});

export const sendDonationDeclineEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.email,
    from: 'noreply@tokenpow.com',
    subject: 'Credit card contribution was not accepted',
    text: `Dear selltoken owner\nA credit card contribution for selltoken ${data.selltokenLink} was not accepted because of following reason:\n${data.reason}\nbest regards,\nTokenPow Team`
  } as MailDataRequired

  await sgMail.send(msg);

  return { sucess: true };
});

export const sendNewselltokenWaitingEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: 'tokenpow@protonmail.com',
    from: 'noreply@gobitfundme.com',
    subject: 'New auction waiting for approval',
    text: `There is new auction waiting for your approval.`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});

export const sendNewBidEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: 'tokenpow@protonmail.com',
    from: 'noreply@gobitfundme.com',
    subject: 'New bid !',
    text: `New bid detected!.`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});

export const sendWithdrawApproveEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    subject: 'Withdraw Approved',
    text: `Hey ${data.userFirstName} ${data.userLastName} your request to sell ${data.amount} coins to GoBitFundMe was approved. Our commision is 10% of ${data.amount}, e.g ${(Number(data.amount / 100) * 10).toFixed(8)}.`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});

export const sendWithdrawDeclineEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    subject: 'Withdraw declined',
    text: `Hey ${data.userFirstName} ${data.userLastName} your request to sell ${data.amount} coins to GoBitFundMe was not approved. Reason is: ${data.reason}`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});

export const sendPerkRequestEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    subject: 'Perk request',
    text: data.message
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true};
});

export const sendNewContributionEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.userEmail,
    from: 'noreply@tokenpow.com',
    subject: 'Your token(s) has been paid for',
    text: `Dear auction owner, \nYour token(s) has been paid for, please transfer the token to the buyer.\nbest regards,\nTokenPow Team`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});

export const sendNewContributionRewardEmail = functions.https.onCall(async (data, context: CallableContext) => {
  const msg = {
    to: data.sharedLinkUserEmail,
    from: 'noreply@tokenpow.com',
    subject: 'New sharing reward',
    text: `Dear user, \nA new sharing reward was awarded to you for this selltoken: ${data.selltokenLink}\nbest regards,\nTokenPow Team`
  } as MailDataRequired

  await sgMail.send(msg);
  return { success: true };
});
