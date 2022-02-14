
# ArrayBufferStream
Utility to streamline read and write operations on ArrayBuffer instances. This is exposed as an ES6 module which is compatible with both browsers and current versions of Node.js.

This can be useful for processing files, WebSocket messages, or other cases where binary data is utilized.

Most methods are direct wrappers on top of the built-in [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) implementation.

Additional changes or enhancements will be added based on need.
## Supported Types

 - UINT8, UINT16, UINT32
 - FLOAT32, FLOAT64
 - UNORM8, UNORM16 (float in range 0-1, with 8 or 16 bit precision)
 - ASCII strings
Note: For performance, bounds are not checked for integral types. Clamp values as necessary or unexpected values may be written on byte overflow.
Clamped variations of each write is provided for convenience.
## Installation
Using **NPM**:

    npm i @jioffe/arraybufferstream
To use:

    import  ArrayBufferStream  from  "@jioffe/arraybufferstream";
Example:
```js
import  ArrayBufferStream  from  "@jioffe/arraybufferstream";

const  stream = new  ArrayBufferStream(64);

stream.writeInt32(55);
stream.writeFloat32(5.5);
stream.writeASCIIString("Hello World");

stream.setCursor(0);

console.log(
	stream.getNextInt32(),
	stream.getNextFloat32(),
	stream.getNextASCIIString()
);
```
This will output:

    >>> 55 5.5 Hello World

## Testing
    npm run test