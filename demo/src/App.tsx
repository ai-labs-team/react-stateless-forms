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
          <p>
            One input is required using the core IsRequiredValidator, the other is left unvalidated.
          </p>
          <RequiredInputsExample />

          <h3>Example: Ensure field values match</h3>
          <p>
            Metavalidation allows cross-field checks.  Here we use FieldMatchMetavalidator to verify
            the two fields have identical content.
          </p>
          <MatchValidationExample />

          <h3>Example: Prepopluate values in the form</h3>
          <p>
            We can hydrate the form with initial values.  This example bypasses our container and simply
            demonstrates the result on the view side.  In a production case, you would wire this to the global
            state object.
          </p>
          <ValuesHydrationExample />

          <h3>Example: Include server-side errors</h3>
          <p>
            The form accepts error objects for display of server-side errors post submission.  For now, this is
            shown in a single block.  A future extension will allow the form to accept keys transmitted from the
            server and display errors in context with the relevant form fields.
          </p>
          <ServerErrorsExample />

          <h3>Example: Custom validation</h3>
          <p>
            This example demonstrates the use of custom validators.  Here, we use EmailValidator to ensure the
            email field includes a "@" character, and we apply a string-length validator to the name field
            to ensure it is at least 3 and most 8 characters long.
          </p>
          <p>
            For good measure, we mix in a field match metavalidator to validate against a confirmation field and
            make all fields required.
          </p>
          <CustomValidatorsExample />
        </div>
      </div>
    );
  }
}

export default App;
