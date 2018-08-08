import * as React from 'react';
import './App.css';

import CustomValidatorsExample from './custom_validators_example';
import MatchValidationExample from './match_validation_example';
import RequiredInputsExample from './required_inputs_example';
import ServerErrorsExample from './server_errors_example';
import ValuesHydrationExample from './values_hydration_example';

class App extends React.Component {

  public render(): JSX.Element {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>casium-forms demo</h1>
        </header>

        <div className='App-intro'>
          <h3>Example: One optional input, one required</h3>
          <RequiredInputsExample />

          <h3>Example: Ensure field values match</h3>
          <MatchValidationExample />

          <h3>Example: Prepopluate values in the form</h3>
          <ValuesHydrationExample />

          <h3>Example: Include server-side errors</h3>
          <ServerErrorsExample />

          <h3>Example: Custom validation</h3>
          <CustomValidatorsExample />
        </div>
      </div>
    );
  }
}

export default App;
