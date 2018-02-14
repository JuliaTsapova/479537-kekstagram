'use strict';

var PICTURES_COUNT = 25;
var minLikes = 15;
var maxLikes = 200;
var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var pictureTemplate = document.querySelector('#picture-template');
var picturesBox = document.querySelector('.pictures');
var gallery = document.querySelector('.gallery-overlay');

var getRandom = function (min, max) {
  return (Math.random() * (max - min) + min).toFixed(0);
};

var getRandomArray = function (array, length, unique) {
  var randomArray = [];
  while (randomArray.length < length) {
    var value = array[getRandom(0, array.length)];
    if (unique && randomArray.indexOf(value) !== -1) {
      continue;
    } else {
      randomArray.push(value);
    }
  }
  return randomArray;
};

var getUrl = function (number) {
  var url = 'photos/' + (number + 1) + '.jpg';
  return url;
};

var getPicture = function (x) {
  return {
    url: getUrl(x),
    likes: getRandom(minLikes, maxLikes),
    comments: getRandomArray(comments, getRandom(1, 2), true)
  };
};

var getPicturesArray = function (arrayLength) {
  var pictures = [];
  for (var i = 0; i < arrayLength; i++) {
    pictures.push(getPicture(i));
  }
  return pictures;
};

var renderPicture = function (data) {
  var picture = pictureTemplate.cloneNode(true);
  picture.content.querySelector('img').src = data.url;
  picture.content.querySelector('.picture-likes').textContent = data.likes;
  picture.content.querySelector('.picture-comments').textContent = data.comments.length;
  return picture;
};

var createFragment = function (array) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderPicture(array[i]));
  }
  return fragment;
};

var pictures = getPicturesArray(PICTURES_COUNT);

picturesBox.appendChild(createFragment(pictures));

var showElement = function (element) {
  gallery.querySelector('.gallery-overlay-image').src = element.url;
  gallery.querySelector('.likes-count').textContent = element.likes;
  gallery.querySelector('.comments-count').textContent = element.comments.length;

};

showElement(pictures[0]);

gallery.classList.remove('hidden');

