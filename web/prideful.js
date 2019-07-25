function getRandomInt( num ) {
  return Math.floor( num * Math.random() );
}

function getRandomColor() {
  return tinycolor.random();
}

function colorToHex( color ) {
  return tinycolor( color ).toHexString();
}

function colorReadable( color ) {
  return tinycolor.mostReadable( color, ["#000", "#fff"]).toHexString();
}

function colorToRgb( color ) {
  return tinycolor( color ).toRgb();
}

function colorToHsl( color ) {
  return tinycolor( color ).toHsl();
}

function mutateColor( color, amount = 0.5 ) {
  var rgb = colorToRgb( color );
  return colorToHex( {
    r: rgb.r + ( getRandomInt( 255 ) - 128 ) * amount,
    g: rgb.g + ( getRandomInt( 255 ) - 128 ) * amount,
    b: rgb.b + ( getRandomInt( 255 ) - 128 ) * amount,
  });
}
