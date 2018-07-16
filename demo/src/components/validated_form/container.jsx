import React from 'react';
import PropTypes from 'prop-types';
import { /* always, evolve, */ merge, omit, /* pathOr */ } from 'ramda';
import { /* commands, */ container, /* message, */ PARENT, replace } from 'casium';
import Message, { Activate, Deactivate, Refresh } from 'casium/message';
// import { Post } from 'casium/commands/http';

/*
import { AuthenticatedPatch, AuthenticatedPost, AuthenticatedPut } from 'messages/commands/http';
import { nameAlreadyExists } from 'utils/api/error_keys';
import Notification from 'messages/commands/notification';
import ServerError, {
  BadRequestError,
  NotFoundError,
  ServiceOutageError,
  UnauthorizedError,
  UnprocessableEntityError,
} from 'messages/server_errors';
*/

import ValidatedForm from './';

/*
export class FormSubmissionAuthPost extends Message {}
export class FormSubmissionPost extends Message {}
export class FormSubmissionPatch extends Message {}
export class FormSubmissionPut extends Message {}
*/
export class FormUpdate extends Message {}
// export class FormSubmissionSuccess extends Message {}
// export class ToggleSubmittingFalse extends Message {}

/*
const requestTypes = {
  add: FormSubmissionAuthPost,
  edit: FormSubmissionPatch,
  post: FormSubmissionPost,
  replace: FormSubmissionPut,
};
*/

const ValidatedFormWrapper = ({ emit, /* type, */ onUpdate, ...props }) => (
  <ValidatedForm
    {...props}
    onUpdate={onUpdate || emit(FormUpdate)}
    onSubmit={() => {}}/> //emit(requestTypes[type])}/>
);

ValidatedFormWrapper.propTypes = {
  emit: PropTypes.func.isRequired,
  type: PropTypes.string,
  onUpdate: PropTypes.func,
};

ValidatedFormWrapper.defaultProps = {
  onUpdate: null,
  type: 'add',
};

/*
const httpAction = constructAction => (model, {}, { token, services }) => ([
  merge(model, { submitting: true }),
  new constructAction({
    base: services.api,
    token,
    url: model.formUrl,
    data: model.resultValues,
    result: FormSubmissionSuccess,
    always: ToggleSubmittingFalse,
  }),
]);
*/

const saveFormUrl = (state, { formUrl }) => merge(state, { formUrl });

const ValidatedFormContainer = container({

  name: 'ValidatedFormContainer',

  init: replace({ submitting: false, errors: [], formUrl: null }),

  delegate: PARENT,

  update: [

    [Activate, saveFormUrl],

    [Refresh, saveFormUrl],

    [Deactivate, omit(['errors', 'formUrl', 'submitting'])],

/*
    [FormSubmissionAuthPost, httpAction(AuthenticatedPost)],

    [FormSubmissionPatch, httpAction(AuthenticatedPatch)],

    [FormSubmissionPost, (model, {}, { services }) => [
      merge(model, { submitting: true }),
      new Post({
        url: services.api + model.formUrl,
        data: model.resultValues,
        result: FormSubmissionSuccess,
        always: ToggleSubmittingFalse,
        error: ServerError,
      }),
    ]],

    [FormSubmissionPut, httpAction(AuthenticatedPut)],
*/

    [FormUpdate, (state, data) => merge(state, { fieldValues: data, resultValues: data })],

/*

    [ToggleSubmittingFalse, evolve({ submitting: always(false) })],

    [ServerError, (state, { response: { data } }) => [
      merge(state, { errors: (state.errors || []).concat(data) }),
      new Notification({
        message: `Error: ${pathOr('', ['response', 'statusText'], data)}`, level: 'error',
      }),
    ]],

    [ServiceOutageError, commands(Notification, {
      message: 'We broke something, maybe come back later. Would you like a hug?',
      level: 'error',
      autoDismiss: 7,
    })],

    [UnauthorizedError, (state, { response: { data } }) => [
      merge(state, { errors: (state.errors || []).concat(data) }),
    ]],

    [NotFoundError, commands(Notification, (_, data) => ({
      message: `Error: Unable to ${data.config.method} to ${data.config.url}`,
      level: 'error',
    }))],

    [BadRequestError, commands(Notification, (_, data) => ({
      message: `${t('notificationMessages.error')}: ${data.response.data.message}`, level: 'error',
    }))],

    [UnprocessableEntityError, commands(Notification, message(({ response: { data } }) =>
      ({
        level: 'error',
        message: `${t('notificationMessages.error')}: ${data.errorKey === nameAlreadyExists
          ? t('notificationMessages.nameAlreadyExists')
          : data.message}`,
      })
    ))],
*/
  ],

  view: ValidatedFormWrapper,
});

export default ValidatedFormContainer;
