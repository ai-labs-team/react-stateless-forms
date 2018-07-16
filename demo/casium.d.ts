import { StatelessComponent } from 'react';

declare module 'casium' {
  type ComputeProps<Props, ComputedProps> = {
    [K in keyof ComputedProps]: (props: Props) => ComputedProps[K]
  };

  export function withProps<Props extends {}, ComputedProps extends {}>(
    computeProps: ComputeProps<Props, ComputedProps>,
    component: StatelessComponent<Props & ComputedProps>
  ): StatelessComponent<Props>;

  export type Expects = {
    [key: string]: (value: any) => boolean;
  };
}
