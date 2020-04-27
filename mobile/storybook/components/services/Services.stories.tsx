import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Google } from "./Google";
import { Facebook } from "./Facebook";
import { RealmDemo } from './RealmDemo';

storiesOf('Services', module)

.add('google', () => (
    <Google />
))

.add('facebook', () => (
    <Facebook />
))

.add('realm', () => (
    <RealmDemo />
))
;