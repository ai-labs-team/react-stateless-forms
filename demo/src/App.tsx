import * as React from 'react';
import './App.css';

import ValidatedForm from './components/validated_form/index';
// import TextInput from './components/inputs/formatted_input/text_input';

import Validated from './components/inputs/validated';
import ValidationSet from './utils/validation_set';
import IsRequiredValidator from './validators/is_required_validator';

const MockInput: React.SFC = (props: any) =>
  <div>
    {props.label && <label htmlFor={props.name}>{props.label}</label>}
    <input onChange={props.onChange}/>
  </div>;

const ValidatedTextInput = Validated(MockInput);

const validations = new ValidationSet({
  requiredInput: [new IsRequiredValidator()],
});

class App extends React.Component {

  public render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>casium-forms demo</h1>
        </header>
        <div className='App-intro'>
          <ValidatedForm
            errors={[]}
            validationSet={validations}
            onSubmit={() => {}}
            onUpdate={() => {}}
            fieldValues={{}}
          >
            <ValidatedTextInput
              name='requiredInput'
              label='Test Input' />
          </ValidatedForm>
        </div>
      </div>
    );
  }
}

export default App;
