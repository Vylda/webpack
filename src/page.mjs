import Logo from 'Images/webpack.svg';
import createImage from './createImage.mjs';
import './css/index.less';
import style from './css/headers.module.less';
import imageStyle from './css/image.module.less';

const header = document.createElement('h1');
header.className = style.headerOne;

header.appendChild(document.createTextNode('Page Webpack file'));

const app = document.querySelector('#app');
app.appendChild(header);
app.appendChild(createImage(Logo, imageStyle.withPadding));

const para = document.createElement('p');
para.textContent = `${PRODUCTION ? 'Jde' : 'Nejde'} o produkční kód.`;
app.appendChild(para);
