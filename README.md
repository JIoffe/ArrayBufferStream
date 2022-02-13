
# ArrayBufferStream
Utility to streamline read and write operations on ArrayBuffer instances. This is exposed as an ES6 module which is compatible with both browsers and current versions of Node.js.

Most methods are direct wrappers on top of the built-in [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) implementation.

Additional changes or enhancements will be added based on need.
## Supported Types

 - UINT8, UINT16, UINT32
 - FLOAT32, FLOAT64
 - ASCII strings

## Testing
    npm run test