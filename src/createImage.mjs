import clsx from 'clsx';
import style from './css/image.module.less';

const createImage = (source, className) => {
  const container = document.createElement('div');

  const image = new Image();
  image.className = clsx(style.image, className);
  image.src = source;

  container.appendChild(image);

  return container;
};

export default createImage;
