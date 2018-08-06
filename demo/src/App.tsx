import * as React from 'react';
import './App.css';

import MatchValidationExample from './matchValidationExample';
import RequiredInputsExample from './requiredInputsExample';

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
        </div>
      </div>
    );
  }
}

export default App;
