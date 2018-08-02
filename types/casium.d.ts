import { StatelessComponent } from 'react';

declare module 'casium' {
  export type Expects = {
    [key: string]: (value: any) => boolean;
  };
}
