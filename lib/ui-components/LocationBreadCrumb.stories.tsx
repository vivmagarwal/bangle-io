import type { Story } from '@storybook/react';
import React from 'react';

import type { FirstParameter } from '@bangle.io/shared-types';

import { LocationBreadCrumb } from './LocationBreadCrumb';

export default {
  title: 'ui-components/LocationBreadCrumb',
  component: LocationBreadCrumb,

  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template: Story<FirstParameter<typeof LocationBreadCrumb>> = (args) => {
  return <LocationBreadCrumb {...args} />;
};

export const Primary = Template.bind({});

Primary.args = {
  filePath: 'hi/brothers',
};
