
const reqSvgs = require.context ( './cardImages/suits', true, /\.svg$/ )

export const suitPaths = reqSvgs
.keys ()
.reduce ( ( images, path ) => {
    images[path] = reqSvgs ( path )
    return images
}, {} );

