import * as React from 'react';
import './App.css';

import ValidatedForm from './components/validated_form/index';

class App extends React.Component {
  public render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>casium-forms demo</h1>
        </header>
        <p className='App-intro'>
          <ValidatedForm>
            testing
          </ValidatedForm>
        </p>
      </div>
    );
  }
}

export default App;
