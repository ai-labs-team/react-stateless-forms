import * as React from 'react';
import './App.css';

import DemoForm from './demoForm';

class App extends React.Component {

  public render(): JSX.Element {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>casium-forms demo</h1>
        </header>
        <div className='App-intro'>
          <DemoForm />
        </div>
      </div>
    );
  }
}

export default App;
