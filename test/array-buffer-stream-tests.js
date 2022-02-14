import chai from 'chai';
import { expect } from 'chai';

import ArrayBufferStream from '../index.js';

const should = chai.should();

/**
 * @type {ArrayBufferStream}
 */
let arrayBufferStream;

describe('ArrayBufferStream Tests', () => {
    beforeEach((done) => {
        arrayBufferStream = new ArrayBufferStream(64, true);
        done();   
    });

    describe('Can allocate new ArrayBuffer for stream', (done) => {
        it('Should have a size matching ArrayBufferStream constructor', (done) => {
            arrayBufferStream.size.should.be.a('number');
            arrayBufferStream.size.should.equal(64);
            done();
        });
    });

    describe('Can set cursor within range', (done) => {
        it('Should throw when setting NaN cursor', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor('one');
            });
            done();
        });

        it('Should throw when setting cursor out of range', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(65);
            });
            should.throw(() => {
                arrayBufferStream.setCursor(-1);
            });
            done();
        });

        it('Should set cursor within range', (done) => {
            should.not.throw(() => {
                arrayBufferStream.setCursor(25);
            });

            arrayBufferStream.cursor.should.equal(25);
            done();
        });
    });

    describe('Can write and read UINT8 values', () => {
        it('Should write and read single UINT8 values', (done) => {
            arrayBufferStream.writeUint8(15);
            arrayBufferStream.writeUint8(24);
            arrayBufferStream.writeUint8(52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint8();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(24);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(52);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeUint8Clamped(15);
            arrayBufferStream.writeUint8Clamped(4124);
            arrayBufferStream.writeUint8Clamped(-141);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint8();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(0xFF);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(0);
            done();
        });

        it('Should write multiple UINT8 values', (done) => {
            arrayBufferStream.writeUint8(15, 24, 52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint8();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(24);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(52);
            done();
        });

        it('Should write multiple UINT8 values using spread', (done) => {
            const values = [15, 24, 52];
            arrayBufferStream.writeUint8(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint8();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(24);

            a = arrayBufferStream.getNextUint8();
            a.should.equal(52);
            done();
        });

        it('Should read and write UINT8 arrays', (done) => {
            const values = new Uint8Array([15, 24, 52]);
            arrayBufferStream.writeUint8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint8Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(15);
            array[1].should.equal(24);
            array[2].should.equal(52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Uint8Array(8).fill(0);
            const values = new Uint8Array([15, 24, 52]);
            arrayBufferStream.writeUint8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint8Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(15);
            array[2].should.equal(24);
            array[3].should.equal(52);
            done();
        });

        it('Should throw when writing UINT8 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(64);
                arrayBufferStream.writeUint8(1);
            });
            done();
        });
    });

    describe('Can write and read INT8 values', () => {
        it('Should write and read single INT8 values', (done) => {
            arrayBufferStream.writeInt8(-2);
            arrayBufferStream.writeInt8(24);
            arrayBufferStream.writeInt8(-52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt8();
            a.should.equal(-2);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(24);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(-52);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeInt8Clamped(15);
            arrayBufferStream.writeInt8Clamped(4124);
            arrayBufferStream.writeInt8Clamped(-141141);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt8();
            a.should.equal(15);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(127);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(-128);
            done();
        });

        it('Should write multiple INT8 values', (done) => {
            arrayBufferStream.writeInt8(-2, 24, -52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt8();
            a.should.equal(-2);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(24);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(-52);
            done();
        });

        it('Should write multiple INT8 values using spread', (done) => {
            const values = [-2, 24, -52];
            arrayBufferStream.writeInt8(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt8();
            a.should.equal(-2);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(24);

            a = arrayBufferStream.getNextInt8();
            a.should.equal(-52);
            done();
        });

        it('Should read and write INT8 arrays', (done) => {
            const values = new Int8Array([-2, 24, -52]);
            arrayBufferStream.writeInt8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextInt8Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(-2);
            array[1].should.equal(24);
            array[2].should.equal(-52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Int8Array(8).fill(0);
            const values = new Int8Array([-2, 24, -52]);
            arrayBufferStream.writeUint8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint8Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(-2);
            array[2].should.equal(24);
            array[3].should.equal(-52);
            done();
        });

        it('Should throw when writing INT8 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(64);
                arrayBufferStream.writeInt8(1);
            });
            done();
        });
    });

    describe('Can write and read UINT16 values', () => {
        it('Should write and read single UINT16 values', (done) => {
            arrayBufferStream.writeUint16(2000);
            arrayBufferStream.writeUint16(3000);
            arrayBufferStream.writeUint16(50);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint16();
            a.should.equal(2000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(50);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeUint16Clamped(15);
            arrayBufferStream.writeUint16Clamped(0xFFFF13AC);
            arrayBufferStream.writeUint16Clamped(-141);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint16();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(0xFFFF);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(0);
            done();
        });

        it('Should write multiple UINT16 values', (done) => {
            arrayBufferStream.writeUint16(2000, 3000, 52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint16();
            a.should.equal(2000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(52);
            done();
        });

        it('Should write multiple UINT16 values using spread', (done) => {
            const values = [2000, 3000, 52];
            arrayBufferStream.writeUint16(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint16();
            a.should.equal(2000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextUint16();
            a.should.equal(52);
            done();
        });

        it('Should read and write UINT16 arrays', (done) => {
            const values = new Uint16Array([2000, 3000, 52]);
            arrayBufferStream.writeUint16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint16Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(2000);
            array[1].should.equal(3000);
            array[2].should.equal(52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Uint16Array(8).fill(0);
            const values = new Uint16Array([2000, 3000, 52]);
            arrayBufferStream.writeUint16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint16Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(2000);
            array[2].should.equal(3000);
            array[3].should.equal(52);
            done();
        });

        it('Should throw when writing UINT6 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(63);
                arrayBufferStream.writeUint16(1);
            });
            done();
        });
    });

    describe('Can write and read INT16 values', () => {
        it('Should write and read single INT16 values', (done) => {
            arrayBufferStream.writeInt16(-2000);
            arrayBufferStream.writeInt16(3000);
            arrayBufferStream.writeInt16(-52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt16();
            a.should.equal(-2000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(-52);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeInt16Clamped(15);
            arrayBufferStream.writeInt16Clamped(0xFFFFF12);
            arrayBufferStream.writeInt16Clamped(-0xFFFF12);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt16();
            a.should.equal(15);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(0x7FFF);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(-32768);
            done();
        });

        it('Should write multiple INT16 values', (done) => {
            arrayBufferStream.writeInt16(-2000, 3000, -52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt16();
            a.should.equal(-2000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(-52);
            done();
        });

        it('Should write multiple INT16 values using spread', (done) => {
            const values = [-2000, 3000, -52];
            arrayBufferStream.writeInt16(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt16();
            a.should.equal(-2000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(3000);

            a = arrayBufferStream.getNextInt16();
            a.should.equal(-52);
            done();
        });

        it('Should read and write INT16 arrays', (done) => {
            const values = new Int16Array([-2000, 3000, -52]);
            arrayBufferStream.writeInt16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextInt16Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(-2000);
            array[1].should.equal(3000);
            array[2].should.equal(-52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Int16Array(8).fill(0);
            const values = new Int16Array([-2000, 3000, -52]);
            arrayBufferStream.writeInt16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextInt16Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(-2000);
            array[2].should.equal(3000);
            array[3].should.equal(-52);
            done();
        });

        it('Should throw when writing INT16 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(63);
                arrayBufferStream.writeInt16(1);
            });
            done();
        });
    });

    describe('Can write and read UINT32 values', () => {
        it('Should write and read single UINT32 values', (done) => {
            arrayBufferStream.writeUint32(0x00FFFFFF);
            arrayBufferStream.writeUint32(0x00F00F00);
            arrayBufferStream.writeUint32(50);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00FFFFFF);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(50);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeUint32Clamped(15);
            arrayBufferStream.writeUint32Clamped(Number.MAX_SAFE_INTEGER);
            arrayBufferStream.writeUint32Clamped(-Number.MAX_SAFE_INTEGER);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint32();
            a.should.equal(15);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(0xFFFFFFFF);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(0);
            done();
        });

        it('Should write multiple UINT32 values', (done) => {
            arrayBufferStream.writeUint32(0x00FFFFFF, 0x00F00F00, 52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00FFFFFF);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(52);
            done();
        });

        it('Should write multiple UINT32 values using spread', (done) => {
            const values = [0x00FFFFFF, 0x00F00F00, 52];
            arrayBufferStream.writeUint32(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00FFFFFF);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextUint32();
            a.should.equal(52);
            done();
        });

        it('Should read and write UINT32 arrays', (done) => {
            const values = new Uint32Array([0x00FFFFFF, 0x00F00F00, 52]);
            arrayBufferStream.writeUint32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint32Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(0x00FFFFFF);
            array[1].should.equal(0x00F00F00);
            array[2].should.equal(52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Uint32Array(8).fill(0);
            const values = new Uint32Array([0x00FFFFFF, 0x00F00F00, 52]);
            arrayBufferStream.writeUint32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUint32Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(0x00FFFFFF);
            array[2].should.equal(0x00F00F00);
            array[3].should.equal(52);
            done();
        });

        it('Should throw when writing UINT32 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(62);
                arrayBufferStream.writeUint32(1);
            });
            done();
        });
    });

    describe('Can write and read INT32 values', () => {
        it('Should write and read single INT32 values', (done) => {
            arrayBufferStream.writeInt32(-0x00FFFFFF);
            arrayBufferStream.writeInt32(0x00F00F00);
            arrayBufferStream.writeInt32(-52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt32();
            a.should.equal(-0x00FFFFFF);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(-52);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeInt32Clamped(15);
            arrayBufferStream.writeInt32Clamped(Number.MAX_SAFE_INTEGER);
            arrayBufferStream.writeInt32Clamped(-Number.MAX_SAFE_INTEGER);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt32();
            a.should.equal(15);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(0x7FFFFFFF);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(-2147483648);
            done();
        });

        it('Should write multiple INT32 values', (done) => {
            arrayBufferStream.writeInt32(-0x00FFFFFF, 0x00F00F00, -52);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt32();
            a.should.equal(-0x00FFFFFF);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(-52);
            done();
        });

        it('Should write multiple INT32 values using spread', (done) => {
            const values = [-0x00FFFFFF, 0x00F00F00, -52];
            arrayBufferStream.writeInt32(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextInt32();
            a.should.equal(-0x00FFFFFF);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(0x00F00F00);

            a = arrayBufferStream.getNextInt32();
            a.should.equal(-52);
            done();
        });

        it('Should read and write INT32 arrays', (done) => {
            const values = new Int32Array([-0x00FFFFFF, 0x00F00F00, -52]);
            arrayBufferStream.writeInt32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextInt32Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.equal(-0x00FFFFFF);
            array[1].should.equal(0x00F00F00);
            array[2].should.equal(-52);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Int32Array(8).fill(0);
            const values = new Int32Array([-0x00FFFFFF, 0x00F00F00, -52]);
            arrayBufferStream.writeInt32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextInt32Array(3, buffer, 1);

            array[0].should.equal(0);
            array[1].should.equal(-0x00FFFFFF);
            array[2].should.equal(0x00F00F00);
            array[3].should.equal(-52);
            done();
        });

        it('Should throw when writing INT32 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(62);
                arrayBufferStream.writeInt32(1);
            });
            done();
        });
    });

    describe('Can write and read FLOAT32 values', () => {
        it('Should write and read single FLOAT32 values', (done) => {
            arrayBufferStream.writeFloat32(-25.6);
            arrayBufferStream.writeFloat32(45000.2);
            arrayBufferStream.writeFloat32(-5200);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-25.6, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(45000.2, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-5200, 0.001);
            done();
        });

        it('Should write multiple FLOAT32 values', (done) => {
            arrayBufferStream.writeFloat32(-25.6, 45000.2, -5200);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-25.6, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(45000.2, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-5200, 0.001);
            done();
        });

        it('Should write multiple FLOAT32 values using spread', (done) => {
            const values = [-25.6, 45000.2, -5200];
            arrayBufferStream.writeFloat32(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-25.6, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(45000.2, 0.001);

            a = arrayBufferStream.getNextFloat32();
            a.should.be.approximately(-5200, 0.001);
            done();
        });

        it('Should read and write INT32 arrays', (done) => {
            const values = new Float32Array([-25.6, 45000.2, -5200]);
            arrayBufferStream.writeFloat32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextFloat32Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.be.approximately(-25.6, 0.001);
            array[1].should.be.approximately(45000.2, 0.001);
            array[2].should.be.approximately(-5200, 0.001);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Float32Array(8).fill(0);
            const values = new Float32Array([-25.6, 45000.2, -5200]);
            arrayBufferStream.writeFloat32(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextFloat32Array(3, buffer, 1);

            array[0].should.be.approximately(0, 0.001);
            array[1].should.be.approximately(-25.6, 0.001);
            array[2].should.be.approximately(45000.2, 0.001);
            array[3].should.be.approximately(-5200, 0.001);
            done();
        });

        it('Should throw when writing FLOAT32 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(62);
                arrayBufferStream.writeFloat32(1);
            });
            done();
        });
    });

    describe('Can write and read FLOAT64 values', () => {
        it('Should write and read single FLOAT64 values', (done) => {
            arrayBufferStream.writeFloat64(0.123456189121212121215);
            arrayBufferStream.writeFloat64(-0.12421510955);
            arrayBufferStream.writeFloat64(5200);

            arrayBufferStream.setCursor(0);
 
            let a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(0.123456189121212121215, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(-0.12421510955, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(5200, 0.0000000000000001);
            done();
        });

        it('Should write multiple FLOAT64 values', (done) => {
            arrayBufferStream.writeFloat64(0.123456189121212121215, -0.12421510955, 5200);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(0.123456189121212121215, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(-0.12421510955, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(5200, 0.0000000000000001);
            done();
        });

        it('Should write multiple FLOAT64 values using spread', (done) => {
            const values = [0.123456189121212121215, -0.12421510955, 5200];
            arrayBufferStream.writeFloat64(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(0.123456189121212121215, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(-0.12421510955, 0.0000000000000001);

            a = arrayBufferStream.getNextFloat64();
            a.should.be.approximately(5200, 0.0000000000000001);
            done();
        });

        it('Should read and write FLOAT64 arrays', (done) => {
            const values = new Float64Array([0.123456189121212121215, -0.12421510955, 5200]);
            arrayBufferStream.writeFloat64(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextFloat64Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.be.approximately(0.123456189121212121215, 0.0000000000000001);
            array[1].should.be.approximately(-0.12421510955, 0.0000000000000001);
            array[2].should.be.approximately(5200, 0.0000000000000001);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Float64Array(8).fill(0);
            const values = new Float64Array([0.123456189121212121215, -0.12421510955, 5200]);
            arrayBufferStream.writeFloat64(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextFloat64Array(3, buffer, 1);

            array[0].should.be.approximately(0, 0.001);
            array[1].should.be.approximately(0.123456189121212121215, 0.0000000000000001);
            array[2].should.be.approximately(-0.12421510955, 0.0000000000000001);
            array[3].should.be.approximately(5200, 0.0000000000000001);
            done();
        });

        it('Should throw when writing FLOAT64 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(57);
                arrayBufferStream.writeFloat64(1);
            });
            done();
        });
    });

    describe('Can write and read UNORM8 values', () => {
        it('Should write and read single UNORM8 values', (done) => {
            arrayBufferStream.writeUNorm8(0.2);
            arrayBufferStream.writeUNorm8(0.5);
            arrayBufferStream.writeUNorm8(1);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.2, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.5, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(1, 0.01);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeUNorm8Clamped(-200);
            arrayBufferStream.writeUNorm8Clamped(0.5);
            arrayBufferStream.writeUNorm8Clamped(200);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.5, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(1, 0.01);
            done();
        });

        it('Should write multiple UNORM8 values', (done) => {
            arrayBufferStream.writeUNorm8(0.2, 0.5, 1);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.2, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.5, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(1, 0.01);
            done();
        });

        it('Should write multiple UNORM8 values using spread', (done) => {
            const values = [0.2, 0.5, 1];
            arrayBufferStream.writeUNorm8(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.2, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(0.5, 0.01);

            a = arrayBufferStream.getNextUNorm8();
            a.should.be.approximately(1, 0.01);
            done();
        });

        it('Should read and write UNORM8 arrays', (done) => {
            const values = new Float32Array([0.2, 0.5, 1]);
            arrayBufferStream.writeUNorm8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUNorm8Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.be.approximately(0.2, 0.01);
            array[1].should.be.approximately(0.5, 0.01);
            array[2].should.be.approximately(1, 0.01);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Float32Array(8).fill(0);
            const values = new Float32Array([0.2, 0.5, 1]);
            arrayBufferStream.writeUNorm8(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUNorm8Array(3, buffer, 1);

            array[0].should.be.approximately(0, 0.001);
            array[1].should.be.approximately(0.2, 0.01);
            array[2].should.be.approximately(0.5, 0.01);
            array[3].should.be.approximately(1, 0.01);
            done();
        });

        it('Should throw when writing UNORM8 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(64);
                arrayBufferStream.writeUNorm8(1);
            });
            done();
        });
    });

    describe('Can write and read UNORM16 values', () => {
        it('Should write and read single UNORM16 values', (done) => {
            arrayBufferStream.writeUNorm16(0.2);
            arrayBufferStream.writeUNorm16(0.5);
            arrayBufferStream.writeUNorm16(1);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.2, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.5, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(1, 0.001);
            done();
        });

        it('Should clamp to valid range', (done) => {
            arrayBufferStream.writeUNorm16Clamped(-200);
            arrayBufferStream.writeUNorm16Clamped(0.5);
            arrayBufferStream.writeUNorm16Clamped(200);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0, 0.091);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.5, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(1, 0.001);
            done();
        });

        it('Should write multiple UNORM16 values', (done) => {
            arrayBufferStream.writeUNorm16(0.2, 0.5, 1);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.2, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.5, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(1, 0.001);
            done();
        });

        it('Should write multiple UNORM16 values using spread', (done) => {
            const values = [0.2, 0.5, 1];
            arrayBufferStream.writeUNorm16(...values);

            arrayBufferStream.setCursor(0);

            let a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.2, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(0.5, 0.001);

            a = arrayBufferStream.getNextUNorm16();
            a.should.be.approximately(1, 0.001);
            done();
        });

        it('Should read and write UNORM16 arrays', (done) => {
            const values = new Float32Array([0.2, 0.5, 1]);
            arrayBufferStream.writeUNorm16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUNorm16Array(3);

            array.length.should.be.a('number');
            array.length.should.equal(3);

            array[0].should.be.approximately(0.2, 0.001);
            array[1].should.be.approximately(0.5, 0.001);
            array[2].should.be.approximately(1, 0.001);
            done();
        });

        it('Should read into buffer with offset', (done) => {
            const buffer = new Float32Array(8).fill(0);
            const values = new Float32Array([0.2, 0.5, 1]);
            arrayBufferStream.writeUNorm16(...values);

            arrayBufferStream.setCursor(0);

            let array = arrayBufferStream.getNextUNorm16Array(3, buffer, 1);

            array[0].should.be.approximately(0, 0.001);
            array[1].should.be.approximately(0.2, 0.001);
            array[2].should.be.approximately(0.5, 0.001);
            array[3].should.be.approximately(1, 0.001);
            done();
        });

        it('Should throw when writing UNORM8 out of bounds', (done) => {
            should.throw(() => {
                arrayBufferStream.setCursor(64);
                arrayBufferStream.writeUNorm8(1);
            });
            done();
        });
    });

    describe('Can write and read ASCII strings', () => {
        it('Should write and read ASCII string', (done) => {
            arrayBufferStream.writeASCIIString('Test');
            arrayBufferStream.writeASCIIString('Apples');
            arrayBufferStream.writeASCIIString('Bananas');

            arrayBufferStream.setCursor(0);

            let str = arrayBufferStream.getNextASCIIString();
            str.should.be.a('string');
            str.should.equal('Test');

            str = arrayBufferStream.getNextASCIIString();
            str.should.be.a('string');
            str.should.equal('Apples');

            str = arrayBufferStream.getNextASCIIString();
            str.should.be.a('string');
            str.should.equal('Bananas');
            done();
        });
    });
});