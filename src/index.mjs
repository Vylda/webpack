// import isEqual from 'lodash/isEqual';
import Logo from 'Images/webpack.webp';
// import isEqual from 'lodash/isEqual.js';
import createImage from './createImage.mjs';
import './css/index.less';
import style from './css/headers.module.less';
import imageStyle from './css/image.module.less';
/*
const array1 = [1, 2, 3];
const array2 = [1, 2, 3];

console.log(isEqual(array1, array2).toString()); // true
console.log('debug Webpack');
debugger;
*/
const header = document.createElement('h1');
header.className = style.headerOne;

const webpackElement = document.createElement('span');
webpackElement.className = style.webpack;
webpackElement.textContent = 'Webpack';

header.appendChild(document.createTextNode('Moje '));
header.appendChild(webpackElement);
header.appendChild(document.createTextNode(' aplikace s less'));

const app = document.querySelector('#app');
app.appendChild(header);
app.appendChild(createImage(Logo, imageStyle.withPadding));
