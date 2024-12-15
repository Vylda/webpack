import format from 'date-fns/format';
import isEqual from 'lodash/isEqual';
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

const array1 = [1, 2, 3];
const array2 = array1;

const arraysIsSame = isEqual(array1, array2);

const info = document.createElement('p');
info.textContent = `Pole ${arraysIsSame ? 'jsou' : 'nejsou'} stejná.`;
app.appendChild(info);

const date = new Date();
const formattedDate = format(date, 'dd. MM. yyyy');

const dateInfo = document.createElement('p');
dateInfo.textContent = `Dnešní datum je ${formattedDate}.`;
app.appendChild(dateInfo);
