/*
    File name: cardPaths.js
    Description: handles path to image of a specfic card
*/
// taken from https://stackoverflow.com/questions/45754739/how-to-import-an-entire-folder-of-svg-images-or-how-to-load-them-dynamically-i
const reqSvgs = require.context ( '../../cardImages/poker-plain-box-qr', true, /\.svg$/ )

export const cardPaths = reqSvgs
.keys ()
.reduce ( ( images, path ) => {
  images[path] = reqSvgs ( path )
  return images
}, {} );