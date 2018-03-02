'use strict';

var PICTURES_COUNT = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
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
var pictureTemplate = document.querySelector('#picture-template').content;
var picturesBox = document.querySelector('.pictures');
var gallery = document.querySelector('.gallery-overlay');
var uploadInput = document.querySelector('#upload-file');
var closeGalleryButton = document.querySelector('.gallery-overlay-close');
var editForm = document.querySelector('.upload-overlay');
var closeEditFormButton = document.querySelector('#upload-cancel');
var editFormPin = document.querySelector('.upload-effect-level-pin');
var levelLine = document.querySelector('.upload-effect-level-line');
var levelValueLine = document.querySelector('.upload-effect-level-val');
var editFormImage = document.querySelector('.effect-image-preview');
var decSizeButton = document.querySelector('.upload-resize-controls-button-dec');
var incSizeButton = document.querySelector('.upload-resize-controls-button-inc');
var sizeValue = document.querySelector('.upload-resize-controls-value');
var effectButtons = document.querySelectorAll('input[name="effect"]');
var effectValue = document.querySelector('.upload-effect-level-value');

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

// удаление всех классов
var removeClassList = function (elem) {
  var classList = elem.classList;
  while (classList.length > 0) {
    classList.remove(classList.item(0));
  }
};

// сбрасываем значения формы
var resetEditForm = function () {
  sizeValue.value = '55%';
  editFormImage.style.transform = 'scale(1)';
  removeClassList(editFormImage);
  editFormImage.classList.add('effect-image-preview');
};

var renderPicture = function (data) {
  var picture = pictureTemplate.cloneNode(true);
  picture.querySelector('img').src = data.url;
  picture.querySelector('.picture-likes').textContent = data.likes;
  picture.querySelector('.picture-comments').textContent = data.comments.length;
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
  var elementSrc = element.querySelector('img').src;
  var elementLikes = element.querySelector('.picture-likes').textContent;
  var elementComments = element.querySelector('.picture-comments').textContent;
  gallery.querySelector('.gallery-overlay-image').src = elementSrc;
  gallery.querySelector('.likes-count').textContent = elementLikes;
  gallery.querySelector('.comments-count').textContent = elementComments;
};

// открытие/закрытие полноэкранной фотографии

var picturesArray = document.querySelectorAll('.picture');

var onGalleryEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeGallery();
  }
};

var onPictureClick = function (evt) {
  evt.preventDefault();
  openGallery();
  showElement(evt.currentTarget);
};

for (var i = 0; i < picturesArray.length; i++) {
  picturesArray[i].addEventListener('click', onPictureClick);
}

var openGallery = function () {
  gallery.classList.remove('hidden');
  document.addEventListener('keydown', onGalleryEscPress);
};

var closeGallery = function () {
  gallery.classList.add('hidden');
  document.removeEventListener('keydown', onGalleryEscPress);
  uploadInput.value = '';
};

closeGalleryButton.addEventListener('click', function () {
  closeGallery();
});

closeGalleryButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeGallery();
  }
});

// открытие/закрытие окна редактирования фотографии

var onEditFormEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeEditForm();
  }
};

var openEditForm = function () {
  editForm.classList.remove('hidden');
  document.addEventListener('keydown', onEditFormEscPress);
};

var closeEditForm = function () {
  editForm.classList.add('hidden');
  document.removeEventListener('keydown', onEditFormEscPress);
  uploadInput.value = '';
  resetEditForm();
};

closeEditFormButton.addEventListener('click', function () {
  closeEditForm();
});

closeEditFormButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeEditForm();
  }
});

uploadInput.addEventListener('change', openEditForm);

// изменение масштаба

var onSizeValueInc = function () {
  var currentSize = sizeValue.value.split('%');
  var changedSize = +currentSize[0] + 25;
  sizeValue.value = changedSize + ' %';
  editFormImage.style.transform = 'scale(0.' + changedSize + ')';
  if (changedSize >= 100) {
    sizeValue.value = '100 %';
    editFormImage.style.transform = 'scale(1)';
  }
};

var onSizeValueDec = function () {
  var currentSize = sizeValue.value.split('%');
  var changedSize = +currentSize[0] - 25;
  sizeValue.value = changedSize + ' %';
  editFormImage.style.transform = 'scale(0.' + changedSize + ')';
  if (changedSize <= 25) {
    sizeValue.value = '25 %';
    editFormImage.style.transform = 'scale(0.25)';
  }
};

decSizeButton.addEventListener('click', onSizeValueDec);

decSizeButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onSizeValueDec();
  }
});

incSizeButton.addEventListener('click', onSizeValueInc);

incSizeButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onSizeValueInc();
  }
});

// изменение эффектов

var onEffectButtonClick = function () {
  var currentId = this.id.split('-');
  var newClass = currentId[1] + '-' + currentId[2];
  removeClassList(editFormImage);
  editFormImage.classList.add('effect-image-preview');
  editFormImage.classList.add(newClass);
};

for (var e = 0; e <= effectButtons.length; e++) {
  effectButtons[e].addEventListener('click', onEffectButtonClick);
}

// считаем уровень насыщенности и изменяем значение соответствующего поля
var onPinPositionChange = function () {
  var pinPosition = levelValueLine.clientWidth / levelLine.clientWidth * 100;
  effectValue.value = pinPosition;
};

editFormPin.addEventListener('mouseup', onPinPositionChange);
