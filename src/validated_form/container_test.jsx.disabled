import { isolate } from 'casium';
import { Activate } from 'casium/message';
import { Post } from 'casium/commands/http';
import ServerError from 'messages/server_errors';
import { AuthenticatedPost, AuthenticatedPatch } from 'messages/commands/http';

import ValidatedFormContainer, {
  FormSubmissionAuthPost,
  FormSubmissionPost,
  FormSubmissionPatch,
  FormUpdate,
  FormSubmissionSuccess,
  ToggleSubmittingFalse,
} from './container';

const relay = {
  token: { access_token: 'TOKEN' },
  services: { api: 'https://apiroot' },
};

const formUrl = '/foo';

const data = {
  email: 'username',
  password: 'totallysecurepassword123',
};

const formData = {
  fieldValues: data,
  resultValues: data,
  formUrl,
  errors: [],
  submitting: true,
};

const genericRequestData = {
  url: relay.services.api + formUrl,
  data,
  result: FormSubmissionSuccess,
  always: ToggleSubmittingFalse,
};

const authPostData = {
  token: relay.token,
  ...genericRequestData,
};

const container = isolate(ValidatedFormContainer, {
  relay,
});

describe('ValidatedFormContainer', () => {
  it('should respond to Activate messages', () => {
    container.dispatch(new Activate({ formUrl }));

    expect(container.state()).to.deep.equal({
      formUrl,
      errors: formData.errors,
      submitting: false,
    });
  });

  it('should respond to FormUpdate messages', () => {
    container.dispatch(new FormUpdate(data));

    expect(container.state()).to.deep.equal({ ...formData, submitting: false });
  });

  it('should respond to FormSubmissionAuthPost messages', () => {
    const commands = container.dispatch(new FormSubmissionAuthPost());

    expect(container.state()).to.deep.equal(formData);

    expect(commands).to.deep.equal([
      new AuthenticatedPost(authPostData),
    ]);
  });

  it('should respond to FormSubmissionPost messages', () => {
    const commands = container.dispatch(new FormSubmissionPost());

    expect(container.state()).to.deep.equal(formData);

    expect(commands).to.deep.equal([
      new Post({
        ...genericRequestData,
        error: ServerError,
      }),
    ]);
  });

  it('should respond to FormSubmissionPatch messages', () => {
    const commands = container.dispatch(new FormSubmissionPatch());

    expect(container.state()).to.deep.equal(formData);

    expect(commands).to.deep.equal([
      new AuthenticatedPatch(authPostData),
    ]);
  });

});
