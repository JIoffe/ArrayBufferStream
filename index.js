const BYTE_TO_NORM = 1 / 0xFF;
const SHORT_TO_NORM = 1 / 0xFFFF;

/**
 * Wraps an ArrayBuffer object with a stream-like interface
 * for read and write operations.
 */
class ArrayBufferStream{
    /**
     * Constructs an ArrayBufferStream
     * @param {(number|ArrayBufferLike|object)} arg Size of ArrayBuffer to allocate or existing allocation
     * @param {boolean} [littleEndian=false] Whether to use "Little Endian" for byte order
     */
    constructor(arg, littleEndian){
        const numValue = +arg;

        /**
         * Underlying ArrayBuffer instance with data for read/write
         * @type {ArrayBuffer}
         */
        this.buffer = null;

        if(!isNaN(numValue)){
            // Numeric value for size
            this.buffer = new ArrayBuffer(Math.floor(numValue));
        }else if(typeof arg === 'object'){
            if(Object.prototype.toString(arg).indexOf('ArrayBuffer') >= 0){
                // ArrayBuffer object passed directly
                this.buffer = arg;
            }else if(Object.prototype.toString(arg.data).indexOf('ArrayBuffer') >= 0){
                // Node Buffer is passed
                const {buffer, byteOffset, byteLength} = arg;

                if(!isNaN(+byteOffset) && !isNaN(+byteLength)){
                    this.buffer = buffer.slice(byteOffset, byteOffset + byteLength);
                }
            }
        }

        if(!this.buffer)
            throw `Unsupported: [${typeof arg}] ${arg}`;

        /**
         * Size of underlying buffer in bytes
         * @type {number}
         */
        this.size = this.buffer.byteLength;

        /**
         * Current read/write offset in bytes
         * @type {number}
         */
        this.cursor = 0;
    
        /**
         * @type {DataView}
         */
        this.dv = new DataView(this.buffer);

        /**
         * @type {boolean}
         */
        this.littleEndian = !!littleEndian;
    }

    /**
     * Sets read/write cursor at specified location
     * @param {number} cursor 
     */
    setCursor(cursor){
        const i = +cursor;

        if(isNaN(i)){
            throw `Invalid value for cursor: ${cursor}`;
        }

        if(i > this.size || i < 0){
            throw `Cursor out of range (cursor: ${cursor}, length: ${this.size})`;
        }

        this.cursor = Math.floor(i);
    }

    /**
     * Adds numeric value(s) as UINT8, advances cursor
     * @param  {...number} val 
     */
    writeUint8(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setUint8(this.cursor++, val[i]);
        }
    }

    /**
     * Reads single UINT8 as number, advances cursor
     */
    getNextUint8(){
        return this.dv.getUint8(this.cursor++);
    }

    /**
     * Reads a series of UINT8 values into a destination buffer.
     * If a buffer is not provided, then a UInt8Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
    getNextUint8Array(length, dest, offset){
        dest = dest || new Uint8Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getUint8(this.cursor++);
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as INT8, advances cursor
     * @param  {...number} val 
     */
    writeInt8(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setInt8(this.cursor++, val[i]);
        }
    }

    /**
     * Reads INT8 as number, advances cursor
     */
    getNextInt8(){
        return this.dv.getInt8(this.cursor++);
    }

    /**
     * Reads a series of INT8 values into a destination buffer.
     * If a buffer is not provided, then new Int8Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextInt8Array(length, dest, offset){
        dest = dest || new Int8Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getInt8(this.cursor++);
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as UINT16, advances cursor
     * @param  {...number} val 
     */
     writeUint16(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setUint16(this.cursor, val[i], this.littleEndian);
            this.cursor += 2;
        }
    }

    /**
     * Reads UINT16 as number, advances cursor
     */
    getNextUint16(){
        const val = this.dv.getUint16(this.cursor, this.littleEndian);
        this.cursor += 2;

        return val;
    }

    /**
     * Reads a series of UINT16 values into a destination buffer.
     * If a buffer is not provided, then new Uint16Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextUint16Array(length, dest, offset){
        dest = dest || new Uint16Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getUint16(this.cursor, this.littleEndian);
            this.cursor += 2;
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as INT16, advances cursor
     * @param  {...number} val 
     */
    writeInt16(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setInt16(this.cursor, val[i], this.littleEndian);
            this.cursor += 2;
        }
    }

    /**
     * Reads INT16 as number, advances cursor
     */
    getNextInt16(){
        const val = this.dv.getInt16(this.cursor, this.littleEndian);
        this.cursor += 2;

        return val;
    }

    /**
     * Reads a series of INT16 values into a destination buffer.
     * If a buffer is not provided, then new Int16Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextInt16Array(length, dest, offset){
        dest = dest || new Int16Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getInt16(this.cursor, this.littleEndian);
            this.cursor += 2;
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as UINT32, advances cursor
     * @param  {...number} val 
     */
     writeUint32(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setUint32(this.cursor, val[i], this.littleEndian);
            this.cursor += 4;
        }
    }

    /**
     * Reads UINT32 as number, advances cursor
     */
    getNextUint32(){
        const val = this.dv.getUint32(this.cursor, this.littleEndian);
        this.cursor += 4;

        return val;
    }

    /**
     * Reads a series of UINT32 values into a destination buffer.
     * If a buffer is not provided, then new Uint32Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextUint32Array(length, dest, offset){
        dest = dest || new Uint32Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getUint32(this.cursor, this.littleEndian);
            this.cursor += 4;
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as INT32, advances cursor
     * @param  {...number} val 
     */
    writeInt32(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setInt32(this.cursor, val[i], this.littleEndian);
            this.cursor += 4;
        }
    }

    /**
     * Reads INT32 as number, advances cursor
     */
    getNextInt32(){
        const val = this.dv.getInt32(this.cursor, this.littleEndian);
        this.cursor += 4;

        return val;
    }

    /**
     * Reads a series of INT16 values into a destination buffer.
     * If a buffer is not provided, then new Int32Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextInt32Array(length, dest, offset){
        dest = dest || new Int32Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getInt32(this.cursor, this.littleEndian);
            this.cursor += 4;
        }

        return dest;
    }

    /**
     * Encodes a float between 0-1 as UINT8, advances cursor
     * @param  {...number} val 
     */
    writeUNorm8(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setUint8(this.cursor++, Math.floor(val[i] * 0xFF), this.littleEndian);
        }
    }

    /**
     * Reads float between 0-1 encoded as a UINT8, advances cursor
     */
    getNextUNorm8(){
        return this.dv.getUint8(this.cursor++, this.littleEndian) * BYTE_TO_NORM;

    }

    /**
     * Reads a series of UNORM8 values into a destination buffer.
     * If a buffer is not provided, then new Float32Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextUNorm8Array(length, dest, offset){
        dest = dest || new Float32Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getUint8(this.cursor++, this.littleEndian) * BYTE_TO_NORM;
        }

        return dest;
    }

    /**
     * Encodes a float between 0-1 as UINT16, advances cursor
     * @param  {...number} val 
     */
     writeUNorm16(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setUint16(this.cursor, Math.floor(val[i] * 0xFFFF), this.littleEndian);
            this.cursor += 2;
        }
    }

    /**
     * Reads float between 0-1 encoded as a UINT16, advances cursor
     */
    getNextUNorm16(){
        const val = this.dv.getUint16(this.cursor, this.littleEndian);
        this.cursor += 2;

        return val * SHORT_TO_NORM;
    }

    /**
     * Reads a series of UNORM16 values into a destination buffer.
     * If a buffer is not provided, then new Float32Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextUNorm16Array(length, dest, offset){
        dest = dest || new Float32Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getUint16(this.cursor, this.littleEndian) * SHORT_TO_NORM;
            this.cursor += 2;
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as FLOAT32, advances cursor
     * @param  {...number} val 
     */
     writeFloat32(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setFloat32(this.cursor, val[i], this.littleEndian);
            this.cursor += 4;
        }
    }

    /**
     * Reads FLOAT32 as number, advances cursor
     */
    getNextFloat32(){
        const val = this.dv.getFloat32(this.cursor, this.littleEndian);
        this.cursor += 4;

        return val;
    }

    /**
     * Reads a series of FLOAT32 values into a destination buffer.
     * If a buffer is not provided, then new Float32Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextFloat32Array(length, dest, offset){
        dest = dest || new Float32Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getFloat32(this.cursor, this.littleEndian);
            this.cursor += 4;
        }

        return dest;
    }

    /**
     * Adds numeric value(s) as FLOAT64, advances cursor
     * @param  {...number} val 
     */
     writeFloat64(...val){
        const n = val?.length;
        for(let i = 0; i < n; ++i){
            this.dv.setFloat64(this.cursor, val[i], this.littleEndian);
            this.cursor += 8;
        }
    }

    /**
     * Reads FLOAT32 as number, advances cursor
     */
    getNextFloat64(){
        const val = this.dv.getFloat64(this.cursor, this.littleEndian);
        this.cursor += 8;

        return val;
    }

    /**
     * Reads a series of FLOAT64 values into a destination buffer.
     * If a buffer is not provided, then new Float64Array will be created.
     * @param {number} length number of values to read
     * @param {ArrayLike<number>} [dest=null] destination buffer
     * @param {number} [offset=0] write offset in destination buffer
     * @returns 
     */
     getNextFloat64Array(length, dest, offset){
        dest = dest || new Float64Array(length);
        offset = Math.floor(offset || 0);

        for(let i = 0; i < length; ++i){
            dest[i + offset] = this.dv.getFloat64(this.cursor, this.littleEndian);
            this.cursor += 8;
        }

        return dest;
    }

    /**
     * Encodes a string as a series of single-byte characters with a null-terminator.
     * These values are limited to the ASCII character range and results may be unpredictable
     * if the string contains multi-byte characters.
     * 
     * The cursor is advanced by the length of the string + 1.
     * @param {string} str 
     * @returns 
     */
    writeASCIIString(str){
        const len = +str?.length;

        for(let i = 0; i < len; ++i){
            this.dv.setUint8(this.cursor++, str.charCodeAt(i));
        }

        this.dv.setUint8(this.cursor++, 0x00);
    }

    /**
     * Reads a null-terminated string of UINT8 characters, advances cursor
     * @returns {string}
     */
    getNextASCIIString(){
        const {size, dv} = this,
              lineBuffer = [];

        let i = this.cursor;

        while(i < size){
            let byte = dv.getUint8(i++);
            if(!byte) break;

            lineBuffer.push(byte);
        }

        const val = String.fromCharCode(...lineBuffer);
        this.cursor = i;

        return val;
    }

    /**
     * Returns a copy of the underlying data buffer up to the current cursor.
     * @returns {ArrayBuffer}
     */
    trimToCursor(){
        return this.buffer.slice(0, this.cursor);
    }
}

export default ArrayBufferStream;