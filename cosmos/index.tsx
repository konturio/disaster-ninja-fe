import { mountDomRenderer } from 'react-cosmos/dom';
import { version as DN_version } from '../package.json';
import { decorators, fixtures, rendererConfig } from './cosmos.userdeps';

mountDomRenderer({ rendererConfig, decorators, fixtures });

if (import.meta.hot) import.meta.hot!.accept();

console.log('Disaster Ninja', DN_version);
