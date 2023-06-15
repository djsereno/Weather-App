function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(' ');
}

function getBgImage(code) {
  const bgImages = {
    113: 'clear',
    116: 'clear',
    119: 'cloudy',
    122: 'overcast',
    143: 'overcast',
    176: 'overcast',
    179: 'overcast',
    182: 'rainy',
    185: 'rainy',
    200: 'lightning',
    227: 'rainy',
    230: 'rainy',
    248: 'overcast',
    260: 'overcast',
    263: 'overcast',
    266: 'overcast',
    281: 'rainy',
    284: 'rainy',
    293: 'cloudy',
    296: 'cloudy',
    299: 'cloudy',
    302: 'rainy',
    305: 'rainy',
    308: 'rainy',
    311: 'rainy',
    314: 'rainy',
    317: 'rainy',
    320: 'rainy',
    323: 'overcast',
    326: 'overcast',
    329: 'overcast',
    332: 'rainy',
    335: 'rainy',
    338: 'rainy',
    350: 'rainy',
    353: 'overcast',
    356: 'rainy',
    359: 'rainy',
    362: 'rainy',
    365: 'rainy',
    368: 'overcast',
    371: 'rainy',
    374: 'rainy',
    377: 'rainy',
    386: 'lightning',
    389: 'lightning',
    392: 'lightning',
    395: 'lightning',
  };
  return bgImages[code];
}

export { titleCase, getBgImage };
